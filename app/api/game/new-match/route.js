import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
};

// Global promise'i cache'le
let cachedClient = null;
let cachedDb = null;

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

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const previousTeams =
      searchParams.get("previous")?.split(",").filter(Boolean) || [];
    const previousMatches =
      searchParams.get("previousMatches")?.split(",").filter(Boolean) || [];

    // Match koleksiyonundan eşleşmeleri al
    const matches = await db.collection("match").find().toArray();

    // Önceki takımları ve eşleşmeleri içermeyen eşleşmeleri filtrele
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

    const [team1Data, team2Data] = await Promise.all([
      db.collection("teams").findOne({ name: selectedMatch.team1 }),
      db.collection("teams").findOne({ name: selectedMatch.team2 }),
    ]);

    if (!team1Data || !team2Data) {
      return Response.json({ retry: true });
    }

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
