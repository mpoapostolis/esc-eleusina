import { ReactNode } from "react";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Status } from "../../store";

export default function MiniGameWrapper(props: {
  children: ReactNode;
  status: Status;
  id?: string;
}) {
  const store = useStore();
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: store.status === props.status ? 1 : 0,
        opacity: store.status === props.status ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        fontFamily: "STIX Two Text",
      }}
      className={clsx(
        "fixed  h-screen  w-screen flex  pointer-events-auto  items-center  justify-center z-50"
      )}
    >
      <div
        id={props.id}
        className="bg-black  w-[90%] h-5/6 pointer-events-auto"
      >
        <img
          onClick={() => {
            store.setStatus("RUNNING");
          }}
          src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff"
          role="button"
          className=" w-10 m-5 h-10 z-50 pointer-events-auto absolute right-0 top-0"
        />
        {props.children}
      </div>
    </motion.div>
  );
}
