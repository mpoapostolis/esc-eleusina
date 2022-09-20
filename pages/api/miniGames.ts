import myDb from "../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await myDb();
  const collection = await db.collection("scenes");

  if (req.method === "GET") {
    const data = await collection.find({}).toArray();
    const boxGames = await db
      .collection("items")
      .find({ type: "box" })
      .toArray();
    return res.status(200).json([
      ...data,
      ...boxGames.map((b) => ({
        type: "box",
        reward: b.reward,
        scene: b.scene,
        _id: b._id,
      })),
    ]);
  } else if (req.method === "POST") {
    try {
      const y = await collection.deleteOne({
        scene: req.body.scene,
      });

      const id = await collection.insertOne(req.body);

      return res.status(201).json({ id: id.insertedId });
    } catch (error) {}
  }
};
