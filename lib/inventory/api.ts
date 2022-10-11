import myDb from "../../helpers/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { getErrors } from "../yupError";
import { ObjectId } from "bson";

let schema = yup.object().shape({
  itemId: yup.string().required(),
});

export async function addItem(req: NextApiRequest, res: NextApiResponse) {
  const body = await schema.validate(req.body);
  const err = getErrors(body);
  if (err) return res.status(400).json(err);
  const id = req.session.user?.id;
  const db = await myDb();
  await db.collection("inventory").insertOne({
    itemId: new ObjectId(body.itemId),
    userId: new ObjectId(id),
  });

  res.status(200).send("ok");
}

export async function getInventory(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const inv = await db
    .collection("inventory")
    .aggregate([
      {
        $match: { userId: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "items",
          localField: "itemId",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },

      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$item", { used: "$used" }] },
        },
      },
      {
        $match: { scene: req.query.scene },
      },
    ])
    .toArray();

  res.status(200).json(inv);
}

export async function updateInv(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const inv = await db.collection("inventory").updateOne(
    {
      userId: new ObjectId(id),
      itemId: new ObjectId(`${req.query.itemId}`),
    },
    {
      $set: req.body,
    }
  );
  res.status(200).json(inv);
}

export async function getAchievements(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.session.user?.id;
  const db = await myDb();
  const inv = await db
    .collection("achievements")
    .find({
      userId: new ObjectId(id),
    })
    .toArray();
  res.status(200).json(inv.map((e) => ({ ...e, _id: e.rewardId })));
}

export async function addAchievements(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.session.user?.id;
  const db = await myDb();
  const inv = await db.collection("achievements").insertOne({
    userId: new ObjectId(id),
    ...req.body,
  });
  res.status(200).json(inv);
}
