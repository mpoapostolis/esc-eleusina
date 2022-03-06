import myDb from "../../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await myDb();
    const collection = await db.collection("library");
    const library = await collection.find({})
    const data = await library.toArray();
    res.status(200).json(data);
};
