
import myDb from "../../helpers/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "bson";


export async function getUsed(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const used = await db
    .collection("used").find({
      userId: new ObjectId(id),
      scene: req.query.scene,
    })
    .toArray();

  res.status(200).json(used);
}
