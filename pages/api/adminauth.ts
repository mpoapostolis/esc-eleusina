// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  if (email !== "adm" && password !== "adm")
    return res.status(401).json({ msg: "bad creds" });
  else return res.status(200).json({ accessToken: "yes" });
}
