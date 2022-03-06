import myDb from "../../../helpers/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await myDb();
    const collection = await db.collection("items");

    switch (req.method) {
        case "GET":
            const imgs = await db.collection("library").find({}).toArray()
            const items = await collection.find({}).toArray()
            let idToImg: Record<string, any> = {}
            imgs.forEach(o => {
                idToImg[`${o._id}`] = o
            })
            const data = items.map(x => ({
                ...x,
                name: idToImg[x.imgId]?.name,
                src: idToImg[x.imgId]?.src,
            }));

            return res.status(200).json(data);

        case "POST":

            const { imgId, collectableIfHandHas, inventorySrc, ...rest } = req.body
            const ids: Record<string, any> = {}
            if (imgId) ids.imgId = new ObjectId(imgId)
            if (collectableIfHandHas) ids.collectableIfHandHas = new ObjectId(collectableIfHandHas)
            if (inventorySrc) ids.inventorySrc = new ObjectId(inventorySrc)
            const id = await collection.insertOne({
                ...rest,
                ...ids
            });
            return res.status(201).json({ id: id.insertedId })

        default:
            return res.status(200).send("");
    }
};
