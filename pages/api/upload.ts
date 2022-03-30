import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { randomUUID } from "crypto";
import myDb from "../../helpers/mongo";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const random = randomUUID();
  const type = req.body.type;
  const ext = type === "svg+xml" ? "svg" : type;

  const src = `https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/${random}.${ext}`;
  await (
    await axios.put(
      `https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/images/${random}.${ext}`,
      JSON.stringify({
        message: `upload image ${random}`,
        content: req.body.data,
      }),
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${process.env["gh_token"]}`,
        },
      }
    )
  ).data;

  const db = await myDb();
  const collection = await db.collection("library");
  const id = await collection.insertOne({ src, name: "" });
  res.status(200).json({ id: id.insertedId });
}
