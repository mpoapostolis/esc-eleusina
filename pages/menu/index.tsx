import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import MenuItem from "../../components/MenuItem";
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

  const tmpInv = Array(16).fill({
    name: "",
    src: "",
  });

  const inv = [...tmpInv];
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

    default:
      return <Main />;
  }
}

const Main = () => {
  return (
    <div className="z-50 grid gap-y-3 w-full p-5">
      <MenuItem
        goTo="/"
        src="https://s2.svgbox.net/octicons.svg?ic=play&color=fff9"
        title="Play"
      />

      <MenuItem
        goTo="/menu/select-level"
        src="https://s2.svgbox.net/materialui.svg?ic=grid_view&color=fff9"
        title="Select level"
      />
      <MenuItem
        goTo="/menu/history"
        src="https://s2.svgbox.net/materialui.svg?ic=library_books&color=fff9"
        title="History"
      />
      <MenuItem
        goTo="/menu/achievements"
        src="https://s2.svgbox.net/octicons.svg?ic=star-fill&color=fff9"
        title="Achievements"
      />
      <form
        className="w-full h-full"
        action="/api/auth?type=logout"
        method="POST"
      >
        <MenuItem
          type="submit"
          src="https://s2.svgbox.net/hero-outline.svg?ic=logout&color=fff9"
          title="LOGOUT"
        />
      </form>
    </div>
  );
};

const Menu: NextPage = () => {
  const store = useStore();
  const ref = useRef<HTMLAudioElement>(null);
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-50">
      <audio ref={ref} src={`/sounds/${store.sound ?? `01_click`}.wav`} />

      <div className="grid container  gap-y-3 w-full p-5">
        <img
          className="w-28 mx-auto h-28 mb-12 "
          src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
          alt=""
        />
        <MenuItem
          goTo="/"
          src="https://s2.svgbox.net/octicons.svg?ic=play&color=fff9"
          title="Play"
        />

        <MenuItem
          goTo="/menu/select-level"
          src="https://s2.svgbox.net/materialui.svg?ic=grid_view&color=fff9"
          title="Select level"
        />
        <MenuItem
          goTo="/menu/history"
          src="https://s2.svgbox.net/materialui.svg?ic=library_books&color=fff9"
          title="History"
        />
        <MenuItem
          goTo="/menu/achievements"
          src="https://s2.svgbox.net/octicons.svg?ic=star-fill&color=fff9"
          title="Achievements"
        />
        <form
          className="w-full h-full"
          action="/api/auth?type=logout"
          method="POST"
        >
          <MenuItem
            type="submit"
            src="https://s2.svgbox.net/hero-outline.svg?ic=logout&color=fff9"
            title="LOGOUT"
          />
        </form>
        <form
          className="w-full h-full"
          action="/api/auth?type=reset"
          method="POST"
        >
          <MenuItem
            type="submit"
            src="https://s2.svgbox.net/hero-outline.svg?ic=logout&color=fff9"
            title="RESET"
          />
        </form>
      </div>
    </div>
  );
};

export default Menu;
