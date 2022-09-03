import myDb from "../../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(myItems);
async function myItems(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const collection = await db.collection("items");
  switch (req.method) {
    case "GET":
      const scene = req.query.scene ? { scene: req.query.scene } : {};
      const emptyImg = await db
        .collection("library")
        .findOne({ type: "empty" });
      const items = await collection
        .aggregate([
          { $match: scene },
          {
            $addFields: {
              imgId: {
                $cond: ["$imgId", "$imgId", new ObjectId(emptyImg?._id)],
              },
            },
          },

          {
            $lookup: {
              from: "library",
              localField: "imgId",
              foreignField: "_id",
              as: "img",
            },
          },
          { $unwind: "$img" },
          {
            $addFields: {
              imgId: "$img._id",
              name: "$img.name",
              src: "$img.src",
            },
          },
        ])
        .toArray();

      return res.status(200).json(items);

    case "POST":
      const { imgId, collectableIfHandHas, reward, inventorySrc, ...rest } =
        req.body;
      const ids: Record<string, any> = {};
      if (imgId) ids.imgId = new ObjectId(imgId);
      if (collectableIfHandHas)
        ids.collectableIfHandHas = new ObjectId(collectableIfHandHas);
      if (req.body.reward) req.body.reward._id = new ObjectId();
      if (inventorySrc) ids.inventorySrc = new ObjectId(inventorySrc);
      const id = await collection.insertOne({
        ...rest,
        ...ids,
      });
      return res.status(201).json({ id: id.insertedId });

    default:
      return res.status(200).send("");
  }
}
