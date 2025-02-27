import { MongoClient } from "mongodb";
import { cache } from "react";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// TLS/SSL parametrelerini ekle
const uri =
  process.env.MONGODB_URI + "&tls=true&tlsAllowInvalidCertificates=true";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
};

// Global promise'i cache'le
let cachedClient = null;
let cachedDb = null;

// Eşleşmeleri önbelleğe alma
let cachedMatches = null;
let cachedTeams = {};
let lastCacheTime = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 saat

async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db("crossClub");

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("MongoDB Bağlantı Hatası:", error);
    throw new Error("Veritabanına bağlanılamadı");
  }
}

async function getMatchesAndTeams(db) {
  const currentTime = Date.now();

  // Önbellek süresi dolmamışsa ve veri varsa, önbellekten döndür
  if (
    cachedMatches &&
    lastCacheTime &&
    currentTime - lastCacheTime < CACHE_DURATION
  ) {
    return { matches: cachedMatches, cachedTeams };
  }

  // Verileri veritabanından çek
  const matches = await db.collection("match").find().toArray();
  cachedMatches = matches;

  // Tüm takımları bir kerede çek
  const teams = await db.collection("teams").find().toArray();
  teams.forEach((team) => {
    cachedTeams[team.name] = team;
  });

  lastCacheTime = currentTime;
  return { matches: cachedMatches, cachedTeams };
}

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const previousTeams =
      searchParams.get("previous")?.split(",").filter(Boolean) || [];
    const previousMatches =
      searchParams.get("previousMatches")?.split(",").filter(Boolean) || [];

    // Önbellekten verileri al
    const { matches, cachedTeams } = await getMatchesAndTeams(db);

    // Filtreleme işlemi
    const availableMatches = matches.filter((match) => {
      const matchId = `${match.team1}-${match.team2}`;
      return (
        !previousTeams.includes(match.team1) &&
        !previousTeams.includes(match.team2) &&
        !previousMatches.includes(matchId)
      );
    });

    if (availableMatches.length === 0) {
      return Response.json({ resetPrevious: true });
    }

    const selectedMatch =
      availableMatches[Math.floor(Math.random() * availableMatches.length)];

    // Takım verilerini önbellekten al
    const team1Data = cachedTeams[selectedMatch.team1];
    const team2Data = cachedTeams[selectedMatch.team2];

    if (!team1Data || !team2Data) {
      return Response.json({ retry: true });
    }

    // Oyuncuları çek (bu kısmı da önbelleğe alabiliriz)
    const commonPlayers = await db
      .collection("players")
      .find({
        team: { $all: [selectedMatch.team1, selectedMatch.team2] },
      })
      .toArray();

    const matchId = `${selectedMatch.team1}-${selectedMatch.team2}`;

    return Response.json({
      teams: [team1Data, team2Data],
      player: commonPlayers[0],
      allPlayers: commonPlayers,
      matchId: matchId,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
