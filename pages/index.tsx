import type { NextPage } from "next";
import { useState } from "react";
import MenuItem from "./components/MenuItem";
import Link from "next/link";
import clsx from "clsx";
import axios, { AxiosError } from "axios";
import { useStore } from "../store";

type Err = {
  email?: string;
  uName?: string;
  password?: string;
  repeatPassword?: string;
};

const Home: NextPage = () => {
  const [state, setState] = useState<
    "main" | "login" | "register" | "selectLevel"
  >("main");
  const store = useStore();
  const [err, setErr] = useState<Err>({});

  function Select() {
    switch (state) {
      case "main":
        return <Main />;

      case "selectLevel":
        return (
          <div className="grid grid-cols-4 gap-4">
            <div
              className={clsx(
                "text-center flex justify-center items-center   text-3xl w-52 h-52",
                {
                  "text-white border-gray-400 border-4 bg-white bg-opacity-10":
                    store.level === "Φως-Σκοτάδι",
                  "text-gray-400 border-gray-700 border-2":
                    store.level !== "Φως-Σκοτάδι",
                }
              )}
              onClick={() => {
                store.setLevel("Φως-Σκοτάδι");
              }}
            >
              Φως-Σκοτάδι
            </div>
            <div
              className={clsx(
                "text-center flex justify-center items-center   text-3xl w-52 h-52",
                {
                  "text-white border-gray-400 border-4 bg-white bg-opacity-10":
                    store.level === "Υπόγειο-Επίγειο",
                  "text-gray-400 border-gray-700 border-2":
                    store.level !== "Υπόγειο-Επίγειο",
                }
              )}
              onClick={() => {
                store.setLevel("Υπόγειο-Επίγειο");
              }}
            >
              Υπόγειο-Επίγειο
            </div>
            <div
              className={clsx(
                "text-center flex justify-center items-center   text-3xl w-52 h-52",
                {
                  "text-white border-gray-400 border-4 bg-white bg-opacity-10":
                    store.level === "Παρελθόν-Παρόν",
                  "text-gray-400 border-gray-700 border-2":
                    store.level !== "Παρελθόν-Παρόν",
                }
              )}
              onClick={() => {
                store.setLevel("Παρελθόν-Παρόν");
              }}
            >
              Παρελθόν-Παρόν
            </div>
            <div
              className={clsx(
                "text-center flex justify-center items-center   text-3xl w-52 h-52",
                {
                  "text-white border-gray-400 border-4 bg-white bg-opacity-10":
                    store.level === "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ",
                  "text-gray-400 border-gray-700 border-2":
                    store.level !== "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ",
                }
              )}
              onClick={() => {
                store.setLevel("ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ");
              }}
            >
              ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ
            </div>
          </div>
        );

      case "register":
      case "login":
        return <Register type={state} />;

      default:
        return <Main />;
    }
  }

  const Main = () => {
    return (
      <>
        <div className="z-50 grid gap-y-3 w-full p-5">
          {store.account.accessToken && (
            <Link href="/play">
              <MenuItem
                src="https://s2.svgbox.net/materialui.svg?ic=games&color=fff9"
                title="Play"
              />
            </Link>
          )}

          {store.account.accessToken && (
            <MenuItem
              onClick={() => setState("selectLevel")}
              src="https://s2.svgbox.net/materialui.svg?ic=grid_view&color=fff9"
              title="Select level"
            />
          )}
          {!store.account.accessToken && (
            <>
              <MenuItem
                onClick={() => setState("login")}
                src="https://s2.svgbox.net/materialui.svg?ic=login&color=fff9"
                title="Login"
              />

              <MenuItem
                onClick={() => setState("register")}
                src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
                title="Register"
              />
            </>
          )}
        </div>
      </>
    );
  };

  const goBack = () => {
    setErr({});
    setState("main");
  };

  function Register(props: { type: "login" | "register" }) {
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
                .then(() => setState("main"))
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
                  "border-red-400 placeholder-red-400 text-red-400":
                    err.password,
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

  function selectImg() {
    switch (store.level) {
      case "Φως-Σκοτάδι":
        return "/scenes/intro.jpg";

      case "Υπόγειο-Επίγειο":
        return "/scenes/karavi.jpg";

      case "Παρελθόν-Παρόν":
        return "/scenes/livadi.jpg";
      case "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ":
        return "/scenes/elaioyrgeio.jpg";

      default:
        break;
    }
  }

  console.log(store.account);

  return (
    <div className="w-screen h-screen bg-black relative">
      <img
        style={{
          filter: "blur(5px)",
        }}
        src={selectImg()}
        className="w-full h-full  "
      />

      <div className="top-0 left-0 absolute bg-black bg-opacity-60  w-screen h-screen flex flex-col justify-center  items-center ">
        <div className="lg:w-1/2 w-full rounded-lg flex flex-col items-center p-10 ">
          {state !== "selectLevel" &&
            (store.account.accessToken && store.account.email ? (
              <div className="w-24 h-24 mb-12 rounded-full bg-gray-400 text-5xl text-gray-800 font-bold flex justify-center items-center">
                {store.account.email[0].toUpperCase()}
              </div>
            ) : (
              <img
                className="w-28 h-28 mb-12"
                src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
                alt=""
              />
            ))}
          <Select />
        </div>
      </div>

      {state !== "main" && (
        <img
          onClick={() => setState("main")}
          role="button"
          src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=fff9"
          className="fixed cursor-pointer top-0 left-0 p-3 w-20"
          alt=""
        />
      )}
    </div>
  );
};

export default Home;
