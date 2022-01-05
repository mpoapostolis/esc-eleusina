// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const login = async () => {
    const { email, password } = req.body;
    const _res = await fetch(
      "http://server.cruiser.gr:8091/escape/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const d = await _res.json();
    return res.status(_res.status).json(d);
  };

  if (req.body.type === "register") {
    const r = await fetch("http://server.cruiser.gr:8091/escape/auth/signup", {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const d = await r.json();
    if (r.status < 400) login();
    // @ts-ignore
    else return res.status(r.status).json<{ msg: string }>({ msg: d.message });
  } else {
    login();
  }
}
