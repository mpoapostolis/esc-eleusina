import myDb from "../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectID } from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await myDb();
  const collection = await db.collection("scenes");
  const data = await collection.find({ type: req.query.type }).toArray();
  if (!data) res.status(400).json({ msg: "not type found" });

  switch (req.query.type) {
    case "lexigram":
      return res.status(200).json(data[0].lexigram.split(","));

    default:
      return res.status(400).json({ msg: "not type found" });
  }
};
