import { Db, MongoClient } from "mongodb";

// Reuse one connection across hot reloads (dev) and warm invocations (prod).
const g = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!g._mongoClient) g._mongoClient = new MongoClient(uri).connect();
  const client = await g._mongoClient;
  return client.db(process.env.MONGODB_DB ?? "scriptdesk");
}
