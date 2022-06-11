import myDb from "../../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await myDb();
  const collection = await db.collection("items");
  switch (req.method) {
    case "PUT":
      if (req.body.reward) req.body.reward._id = new ObjectId();

      await collection.updateOne(
        { _id: new ObjectId(`${req.query.id}`) },
        {
          $set: req.body,
        }
      );
      return res.status(204).send("resource updated successfully");
    case "DELETE":
      await collection.deleteOne({ _id: new ObjectId(`${req.query.id}`) });
      return res.status(204).send("resource deleted successfully");

    default:
      return res.status(200).send("");
  }
};
