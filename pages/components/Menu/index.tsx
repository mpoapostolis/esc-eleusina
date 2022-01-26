import type { NextPage } from "next";
import { useState } from "react";
import MenuItem from "../MenuItem";
import Link from "next/link";
import clsx from "clsx";
import axios, { AxiosError } from "axios";
import { Level, Scene, useStore } from "../../../store";
import { useRouter } from "next/dist/client/router";
import { loadSound } from "../../../utils";
const hint = loadSound("/sounds/hint.wav");

// @ts-ignore
const stages: Record<Level, { label: string; key: Scene }[]> = {
  "Φως-Σκοτάδι": [
    { label: "Αρχική", key: "intro" },
    { label: "Αρχαιολογικός", key: "archeologikos" },
    { label: "Ελαιουργείο ", key: "elaioyrgeio" },
    { label: "Καράβι", key: "karavi" },
    { label: "Λιβάδι", key: "livadi" },
  ],
};

type Err = {
  email?: string;
  uName?: string;
  password?: string;
  repeatPassword?: string;
};

const levels: Level[] = [
  "Φως-Σκοτάδι",
  "Υπόγειο-Επίγειο",
  "Παρελθόν-Παρόν",
  "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ",
];

type Type = "menu" | "login" | "register" | "selectLevel" | "inventory";

function Register(props: { type: "login" | "register" }) {
  const router = useRouter();
  const store = useStore();
  const setType = (type: Type) =>
    router.push({
      query: { type },
    });
  const [err, setErr] = useState<Err>({});

  const goBack = () => {
    hint?.play();
    setErr({});
    router.back();
  };
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr({});
          // @ts-ignore
          const { email, uName, password, repeatPassword } = e.currentTarget;
          if (email.value === "")
            setErr((s) => ({ ...s, key: "email", value: "" }));
          if (password.value === "")
            setErr((s) => ({ ...s, key: "password", value: "" }));
          if (uName?.value && uName.value === "")
            setErr((s) => ({ ...s, key: "uName", value: "" }));
          if (Boolean(repeatPassword)) {
            if (repeatPassword.value === "")
              setErr((s) => ({ ...s, key: "repeatPassword", value: "" }));
            if (password?.value !== repeatPassword?.value)
              setErr((s) => ({ ...s, key: "repeatPassword", value: "" }));
          }
          const body = {
            email: email.value,
            password: password.value,
            ...props,
          } as any;
          if (props.type === "register" && repeatPassword && uName) {
            body.repeatPassword = repeatPassword.value;
            body.name = uName.value;
          }
          if (Object.keys(err).length === 0)
            await axios
              .post("/api/auth", body)
              .then((d) => {
                store.setEmail(email.value);
                store.setToken(d.data.accessToken);
              })
              .then(() => setType("menu"))
              .catch((err: AxiosError) => {
                setErr({
                  email: err.response?.data.msg,
                });
              });
        }}
        className="grid gap-y-3  w-full p-5"
      >
        {props.type === "register" && (
          <input
            name="uName"
            placeholder="Name"
            className={clsx(
              `
      text-shadow border border-gray-400 bg-black bg-opacity-70 placeholder-gray-600
      text-center flex justify-center items-center h-20 text-yellow-50 text-3xl  font-bold shadow-lg
      `,
              {
                "border-red-400 placeholder-red-400 text-red-400": err.uName,
              }
            )}
          />
        )}

        <input
          name="email"
          placeholder={err.email ?? "Email"}
          className={clsx(
            `
      text-shadow border border-gray-400 bg-black bg-opacity-70  placeholder-gray-600
      text-center flex justify-center items-center h-20 text-yellow-50 text-3xl  font-bold shadow-lg
      `,
            {
              "border-red-400 placeholder-red-400 text-red-400": err.email,
            }
          )}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={clsx(
            `
      text-shadow border border-gray-400 bg-black bg-opacity-70  placeholder-gray-600
      text-center flex justify-center items-center h-20 text-yellow-50 text-3xl  font-bold shadow-lg
      `,
            {
              "border-red-400 placeholder-red-400 text-red-400": err.password,
            }
          )}
        />

        {props.type === "register" && (
          <input
            name="repeatPassword"
            type="password"
            placeholder="Repeat password"
            className={clsx(
              `
      text-shadow border border-gray-400 bg-black bg-opacity-70 placeholder-gray-600
      text-center flex justify-center items-center h-20 text-yellow-50 text-3xl  font-bold shadow-lg
      `,
              {
                "border-red-400 placeholder-red-400 text-red-400": err.password,
              }
            )}
          />
        )}
        <div className="grid grid-cols-2 gap-x-2">
          <button
            type="reset"
            onClick={goBack}
            className="text-shadow border border-gray-400 bg-black bg-opacity-70
          text-center flex justify-center items-center h-20 text-gray-400 text-3xl  font-bold shadow-lg"
          >
            Άκυρο
          </button>

          <button
            type="submit"
            className={clsx(
              "text-shadow border border-gray-400 bg-black bg-opacity-100 text-center flex justify-center items-center h-20 text-gray-400 text-3xl  font-bold shadow-lg"
            )}
          >
            {props.type === "register" ? `Εγγραφή` : "Είσοδος"}
          </button>
        </div>
      </form>
    </>
  );
}

function Select() {
  const router = useRouter();
  const type = (router.query.type ?? "menu") as Type;
  const store = useStore();
  switch (type) {
    case "menu":
      return <Main />;

    case "selectLevel":
      const lvl = router.query.lvl as Level;
      if (lvl)
        return (
          <div className="grid grid-cols-4 gap-4">
            {stages[lvl]?.map((l) => (
              <div key={l.key}>
                <h1 className="text-white text-2xl text-center">{l.label}</h1>
                <img
                  onClick={() => {
                    hint?.play();
                    store.setScene(l.key);
                    router.push("/");
                  }}
                  src={`/scenes/${l.key}.jpg`}
                  className={
                    "cursor-pointer text-center text-white border-gray-700  border-4 bg-white bg-opacity-10 flex justify-center items-center   text-3xl w-52 h-52"
                  }
                />
              </div>
            ))}
          </div>
        );
      else
        return (
          <div className="grid grid-cols-4 gap-4">
            {levels.map((lvl) => (
              <div
                key={lvl}
                className={clsx(
                  "text-center text-white border-gray-400 border-4 flex justify-center items-center   text-3xl w-52 h-52",
                  {
                    "bg-white  border-white bg-opacity-10 cursor-pointer text-white":
                      lvl === "Φως-Σκοτάδι",
                    "text-gray-700 border-gray-700 border-2 cursor-not-allowed":
                      lvl !== "Φως-Σκοτάδι",
                  }
                )}
                onClick={() => {
                  hint?.play();
                  store.setLevel(lvl);
                  router.push({
                    query: {
                      ...router.query,
                      lvl,
                    },
                  });
                }}
              >
                {lvl}
              </div>
            ))}
          </div>
        );

    case "inventory":
      return (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={clsx(
                "text-white border-gray-400 border-4 bg-white bg-opacity-10  p-3 w-32 h-32 z-50"
              )}
            >
              {store.inventory[i] && (
                <div className="relative">
                  <div className="text-xs absolute mx-auto -bottom-3  w-full text-center ">
                    {store.inventory[i].name}
                  </div>
                  <img className="w-full" src={store.inventory[i].src} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "register":
    case "login":
      return <Register type={type} />;

    default:
      return <Main />;
  }
}

const Main = () => {
  const router = useRouter();
  const store = useStore();
  const setType = (type: Type) =>
    router.push({
      query: { type },
    });
  return (
    <div className="z-50 grid gap-y-3 w-full p-5">
      {store.account.accessToken && (
        <Link href="/">
          <MenuItem
            src="https://s2.svgbox.net/materialui.svg?ic=games&color=fff9"
            title="Play"
          />
        </Link>
      )}

      {store.account.accessToken && (
        <>
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("selectLevel");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=grid_view&color=fff9"
            title="Select level"
          />
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("inventory");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=inventory&color=fff9"
            title="Inventory"
          />
        </>
      )}

      {!store.account.accessToken && (
        <>
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("login");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=login&color=fff9"
            title="Login"
          />

          <MenuItem
            onClick={() => {
              hint?.play();
              setType("register");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
            title="Register"
          />
        </>
      )}
    </div>
  );
};

const Menu: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  const type = router.query.type as Type;
  return (
    <div
      className={clsx("fixed w-screen h-screen bg-black bg-opacity-20 z-50", {
        hidden: !type,
      })}
    >
      <div className="top-0 left-0 absolute bg-black bg-opacity-80  w-screen h-screen flex flex-col justify-center  items-center ">
        <div className="lg:w-1/2 w-full  rounded-lg flex flex-col items-center p-10 ">
          {type !== "selectLevel" &&
            (store.account.accessToken && store.account.email ? (
              <div className="mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-400 text-5xl text-gray-800 font-bold flex justify-center items-center">
                  {store.account.email[0].toUpperCase()}
                </div>
                <br />
                <h1 className="text-center text-white text-lg">
                  {store.account.email}
                </h1>
                <h1 className="text-center text-white text-lg">
                  Level: {store.level}
                </h1>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <img
                  className="w-28 h-28 mb-12 "
                  src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
                  alt=""
                />
              </div>
            ))}
          <Select />
        </div>
      </div>

      {type !== "menu" && (
        <img
          onClick={() => {
            hint?.play();
            router.back();
          }}
          role="button"
          src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=fff9"
          className="fixed cursor-pointer top-0 left-0 p-3 w-20"
          alt=""
        />
      )}
    </div>
  );
};

export default Menu;
