import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client = null;
let isConnecting = false;

async function getClient() {
  if (client) return client;
  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return client;
  }

  isConnecting = true;
  client = new MongoClient(uri);
  await client.connect();
  isConnecting = false;
  return client;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const previousTeams =
      searchParams.get("previous")?.split(",").filter(Boolean) || [];
    const previousMatches =
      searchParams.get("previousMatches")?.split(",").filter(Boolean) || [];

    const mongoClient = await getClient();
    const db = mongoClient.db("crossClub");

    // Match koleksiyonundan eşleşmeleri al
    const matches = await db.collection("match").find().toArray();

    // Önceki takımları ve eşleşmeleri içermeyen eşleşmeleri filtrele
    const availableMatches = matches.filter((match) => {
      // Eşleşmenin benzersiz ID'sini oluştur
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

    // Rastgele bir eşleşme seç
    const selectedMatch =
      availableMatches[Math.floor(Math.random() * availableMatches.length)];

    // Teams koleksiyonundan takım bilgilerini al
    const team1Data = await db
      .collection("teams")
      .findOne({ name: selectedMatch.team1 });
    const team2Data = await db
      .collection("teams")
      .findOne({ name: selectedMatch.team2 });

    // Eğer takım bilgileri bulunamazsa retry döndür
    if (!team1Data || !team2Data) {
      return Response.json({ retry: true });
    }

    // Ortak oyuncuları bul
    const commonPlayers = await db
      .collection("players")
      .find({
        team: { $all: [selectedMatch.team1, selectedMatch.team2] },
      })
      .toArray();

    // Eşleşmenin benzersiz ID'sini oluştur
    const matchId = `${selectedMatch.team1}-${selectedMatch.team2}`;

    return Response.json({
      teams: [team1Data, team2Data],
      player: commonPlayers[0],
      allPlayers: commonPlayers,
      matchId: matchId,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ retry: true });
  }
}
