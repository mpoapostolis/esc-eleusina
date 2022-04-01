import type { NextPage } from "next";
import { useEffect, useState } from "react";
import MenuItem from "../MenuItem";
import Link from "next/link";
import clsx from "clsx";
import axios, { AxiosError } from "axios";
import {
  HelpKey,
  Item,
  Level,
  Scene,
  setKey,
  Status,
  useStore,
} from "../../store";
import { useRouter } from "next/dist/client/router";
import { loadSound } from "../../utils";
const hint = loadSound("/sounds/hint.wav");

export const ACHIEVEMENTS = ["kernos", "stone", "peiraias"];

// @ts-ignore
export const stages: Record<
  Level,
  { label: string; key: Scene; hover: HelpKey }[]
> = {
  "Φως-Σκοτάδι": [
    { label: "1", key: "teletourgeio", hover: "archPortalHover" },
    { label: "2 ", key: "karnagio", hover: "karnagioPortalHover" },
    { label: "3 ", key: "elaiourgeio", hover: "elaiourgeioPortalHover" },
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

function Register() {
  const store = useStore();
  const [err, setErr] = useState<Err>({});

  const goBack = () => {
    hint?.play();
    setErr({});
    store.setStatus("RUNNING");
  };
  const type = store.status.toLowerCase();
  const router = useRouter();
  return (
    <>
      <form
        onSubmit={async (e) => {
          const isAdmin = router.pathname === "/admin";
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
            type,
          } as any;
          if (type === "register" && repeatPassword && uName) {
            body.repeatPassword = repeatPassword.value;
            body.name = uName.value;
          }
          if (Object.keys(err).length === 0)
            await axios
              // .post(isAdmin ? "/api/adminauth" : "/api/auth", body)
              .post("/api/adminauth", body)
              .then((d) => {
                store.setEmail(email.value);
                store.setToken(d.data.accessToken);
                setKey(d.data.accessToken);
              })
              .then(() => {
                store.setStatus(isAdmin ? "RUNNING" : "MENU");
              })
              .catch((err: AxiosError) => {
                setErr({
                  email: err.response?.data.msg,
                });
              });
        }}
        className="grid gap-y-3  w-full p-5"
      >
        {type === "register" && (
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

        {type === "register" && (
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
            {type === "register" ? `Εγγραφή` : "Είσοδος"}
          </button>
        </div>
      </form>
    </>
  );
}

function SceneSelect() {
  const [lvl, setLevel] = useState<Level>();
  const store = useStore();
  return lvl ? (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
      {stages[store.level]?.map((l) => (
        <div key={l.key}>
          <h1 className="text-white text-2xl text-center">{l.label}</h1>
          <img
            onClick={() => {
              hint?.play();
              store.setScene(l.key);
              store.setStatus("RUNNING");
            }}
            src={`/scenes/${l.key}.jpg`}
            className={
              "cursor-pointer text-center text-white border-gray-700  border-4 bg-white bg-opacity-10 flex justify-center items-center   text-3xl w-52 h-52"
            }
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="grid md:grid-cols-2 3xl:grid-cols-4 gap-4">
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
            setLevel(lvl);
          }}
        >
          {lvl}
        </div>
      ))}
    </div>
  );
}

function Select() {
  const store = useStore();
  const ach = store.epicInventory;

  const tmpInv = Array(16 - ach.length).fill({
    name: "",
    src: "",
  });

  const inv = [...ach, ...tmpInv];

  switch (store.status) {
    case "MENU":
      return <Main />;

    case "SELECT_LEVEL":
      return <SceneSelect />;

    case "ACHIEVEMENTS":
      return (
        <div className="grid grid-cols-4 gap-4">
          {inv.map((item, i) => (
            <div
              key={i}
              className={
                "text-white border-gray-400 border-4 bg-white bg-opacity-10  p-3 w-32 h-32 z-50"
              }
            >
              <div className="relative">
                <div className="text-xs absolute mx-auto -bottom-3  w-full text-center ">
                  {item.name}
                </div>
                <img className="w-full" src={item.src} alt="" />
              </div>
            </div>
          ))}
        </div>
      );

    case "REGISTER":
    case "LOGIN":
      return <Register />;

    default:
      return <Main />;
  }
}

const Main = () => {
  const store = useStore();

  const setType = (status: Status) => store.setStatus(status);
  const router = useRouter();
  return (
    <div className="z-50 grid gap-y-3 w-full p-5">
      {store.account.accessToken && (
        <a
          onClick={() => {
            router.push("/");
          }}
        >
          <MenuItem
            onClick={() => store.setStatus("RUNNING")}
            src="https://s2.svgbox.net/materialui.svg?ic=games&color=fff9"
            title="Play"
          />
        </a>
      )}

      {store.account.accessToken && (
        <>
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("SELECT_LEVEL");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=grid_view&color=fff9"
            title="Select level"
          />
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("HISTORY");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=library_books&color=fff9"
            title="History"
          />
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("ACHIEVEMENTS");
            }}
            src="https://s2.svgbox.net/octicons.svg?ic=star-fill&color=fff9"
            title="Achievements"
          />
        </>
      )}

      {!store.account.accessToken && (
        <>
          <MenuItem
            onClick={() => {
              hint?.play();
              setType("LOGIN");
            }}
            src="https://s2.svgbox.net/materialui.svg?ic=login&color=fff9"
            title="Login"
          />

          {router.pathname !== "/admin" && (
            <MenuItem
              onClick={() => {
                hint?.play();
                setType("REGISTER");
              }}
              src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
              title="Register"
            />
          )}
        </>
      )}
    </div>
  );
};

const Menu: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  const type = router.query.type;

  return (
    <div
      className={clsx("fixed w-screen h-screen bg-black bg-opacity-20 z-50", {
        hidden: ![
          "REGISTER",
          "ACHIEVEMENTS",
          "LOGIN",
          "SELECT_LEVEL",
          "MENU",
        ].includes(store.status),
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

      {store.status !== "MENU" && (
        <img
          onClick={() => {
            hint?.play();
            store.setStatus("MENU");
          }}
          role="button"
          src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=fff9"
          className="fixed cursor-pointer top-0 left-0 p-3 w-20"
          alt=""
        />
      )}
      <img
        onClick={() => {
          store.setAncientText(undefined);
        }}
        src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff9"
        role="button"
        className=" w-12 m-5 h-12 z-50 pointer-events-auto absolute right-0 top-0"
      />
    </div>
  );
};

export default Menu;
