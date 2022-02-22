import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import { randomUUID } from 'crypto';


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

const atob = (a: string) => Buffer.from(a, 'base64').toString('binary')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const confInfo = await (await axios.get("https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/assets_conf.json", {
    headers: {
      "Authorization": `token ${process.env["gh_token"]}`
    }
  })).data
  const conf = JSON.parse(atob(confInfo.content));

  res.status(200).json(conf)
}
