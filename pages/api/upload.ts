import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'



export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const x = JSON.stringify({ a: 1 })
  let objJsonB64 = Buffer.from(x).toString("base64");


  console.log(objJsonB64)
  await axios.put("https://api.github.com/repos/mpoapostolis/escape-vr/contents/public/" + Math.random() + ".json",
    // JSON.stringify({ "message": "new image from api" + Math.random(), "content": req.body.data }),
    JSON.stringify('eyJhIjozfQ=='),
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Authorization": "token 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"
      }
    }).then(d => res.status(200).json(d.data)).catch(
      (d: AxiosError) => res.status(400).json(d.response?.data)
    )
}
