import { NextApiRequest, NextApiResponse } from "next";
import {
  createUser,
  getUser,
  login,
  logout,
  updateUser,
} from "../../lib/users/api";
import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getUser(req, res);
    case "PUT":
      return updateUser(req, res);
    case "POST":
      switch (req.query.type) {
        case "login":
          return login(req, res);

        case "logout":
          return logout(req, res);

        case "register":
          return createUser(req, res);
      }

    default:
      // res.status(405).send("No method allowed");
      break;
  }
}
