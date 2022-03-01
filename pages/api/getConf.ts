import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

const atob = (a: string) => Buffer.from(a, 'base64').toString('binary')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const confInfo = await (await axios.get("https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/assets_conf.json", {
    headers: {
      "Authorization": `token ${process.env["gh_token"]}`,
      "Content-Type": "application/json; charset=UTF-8",
    }
  })).data
  const conf = JSON.parse(b64DecodeUnicode(confInfo.content));

  res.status(200).json(conf)
}
