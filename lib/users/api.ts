import myDb from "../../helpers/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { getErrors } from "../yupError";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
const saltRounds = 10;

let schema = yup.object().shape({
  userName: yup.string().required(),
  password: yup.string().required("Password is required").min(6),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const body = await schema.validate(req.body).catch((err) => {
    return err;
  });
  const err = getErrors(body);
  if (err) return res.status(400).json(err);
  const { password, passwordConfirmation, ...rest } = body;
  const _password = await bcrypt.hash(password, saltRounds);
  const db = await myDb();
  const id = await db
    .collection("users")
    .insertOne({ ...rest, password: _password });
  await req.session.destroy();
  req.session.user = {
    id: id.insertedId.toString(),
  };
  await req.session.save();
  return res.writeHead(302, { Location: "/?newUser=true" }).end();
}

let loginSchema = yup.object().shape({
  userName: yup.string().required(),
  password: yup.string().required("Password is required"),
});

export async function login(req: NextApiRequest, res: NextApiResponse) {
  const body = await loginSchema.validate(req.body).catch((err) => {
    return err;
  });

  const err = getErrors(body);
  if (err) return res.status(400).json(err);

  const db = await myDb();
  const user = await db
    .collection("users")
    .findOne({ userName: body.userName });
  if (!user)
    return res.status(400).json({ msg: `password or username incorrect` });

  const match = await bcrypt.compareSync(body?.password, user?.password);
  if (match && user?._id) {
    req.session.user = {
      admin: user?.admin,
      id: user?._id.toString(),
    };
    await req.session.save();
    return res.writeHead(302, { Location: user?.admin ? "/admin" : "/" }).end();
  } else {
    return res.status(400).json({ msg: `password or username incorrect` });
  }
}

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  await req.session.destroy();
  return res.writeHead(302, { Location: "/login" }).end();
}

export async function reset(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();

  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        scene: "intro",
        time: 600,
      },
    }
  );
  await db.collection("achievements").deleteMany({
    userId: new ObjectId(id),
  });
  await db.collection("used").deleteMany({
    userId: new ObjectId(id),
  });

  await db.collection("inventory").deleteMany({
    userId: new ObjectId(id),
  });

  await db.collection("users").updateOne(
    {
      userId: new ObjectId(id),
    },
    {
      $set: {
        scene: "intro",
        time: 600,
      },
    }
  );

  await db.collection("items").updateMany(
    {},
    {
      $set: {
        replaced: [],
      },
    }
  );

  return res.writeHead(302, { Location: "/" }).end();
}

export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const users = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: req.body,
    }
  );
  res.status(200).json(users);
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const users = await db.collection("users").findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        _id: 1,
        time: 1,
        userName: 1,
        scene: 1,
      },
    }
  );
  res.status(200).json(users);
}
