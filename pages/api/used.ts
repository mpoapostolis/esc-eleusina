import type { NextApiRequest, NextApiResponse } from "next";
import { getUsed, } from "../../lib/used/api";
import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(invRoute);

async function invRoute(req: NextApiRequest, res: NextApiResponse) {
    if (!req.session?.user) return res.status(401).send("401 Unauthorized");


    switch (req.method) {
        case "GET":
            return getUsed(req, res);

        default:
            return res.status(200).send("");
    }
}
