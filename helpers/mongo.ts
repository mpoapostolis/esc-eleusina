import { MongoClient, Db } from "mongodb";


const URI =
    process.env["MONGO_URI"] as string

let cachedDb: Db | null = null;

export default async function thriftDb(): Promise<Db> {
    if (cachedDb) return cachedDb;

    const client = await MongoClient.connect(URI);
    const db = await client.db("escape");

    cachedDb = db;
    return db;
}


