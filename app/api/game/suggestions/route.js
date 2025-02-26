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
    const query = searchParams.get("q") || "";

    const mongoClient = await getClient();
    const db = mongoClient.db("crossClub");

    // Boşlukları regex için güvenli hale getiriyoruz
    const sanitizedQuery = query.replace(/\s+/g, ".*");

    const players = await db
      .collection("players")
      .find({
        name: {
          $regex: `(^|\\s).*${sanitizedQuery}`,
          $options: "i",
        },
      })
      .toArray();

    return Response.json({ players });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message });
  }
}
