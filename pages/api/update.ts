import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}


const atob = (a: string) => Buffer.from(a, 'base64').toString('binary')
const btoa = (x: any) => (Buffer.from(JSON.stringify(x)).toString("base64"));
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const confInfo = await (await axios.get("https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/assets_conf.json", {
    headers: {
      "Authorization": `token ${process.env["gh_token"]}`
    }
  })).data
  const oldConf = JSON.parse(atob(confInfo.content));
  const newConf = { ...oldConf, items: req.body.items }
  const objJsonB64 = btoa(newConf)

  await axios.put("https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/assets_conf.json",
    JSON.stringify({
      "message": `conf updated`, "content": objJsonB64,
      "sha": confInfo.sha
    }),
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Authorization": `token ${process.env["gh_token"]}`
      }
    }).then(d => res.status(200).json(newConf)).catch(
      (d: AxiosError) => res.status(400).json(d.response?.data)
    )
}
