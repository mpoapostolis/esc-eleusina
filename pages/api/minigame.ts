import myDb from "../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await myDb();
  const collection = await db.collection("scenes");

  const found = await collection.find({
    scene: req.body.scene,
  });

  if (found) {
    await collection.updateOne(
      { scene: req.body.scene },
      {
        $set: req.body,
      }
    );
    return res.status(204).send("resource updated successfully");
  } else {
    const id = await collection.insertOne({ ...req.body });
    return res.status(201).json({ id: id.insertedId });
  }
};
