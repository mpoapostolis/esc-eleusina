import myDb from "../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectID } from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await myDb();
  const collection = await db.collection("scenes");

  if (req.method === "GET") {
    const data = await db.collection("scenes").find({}).toArray();
    return res.status(200).json(data);
  } else {
    try {
      const yh = await collection.deleteOne({
        scene: req.body.scene,
      });
      const id = await collection.insertOne({
        _id: new ObjectID(),
        ...req.body,
      });

      return res.status(201).json({ id: id.insertedId });
    } catch (error) {}
  }
};
