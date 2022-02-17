import clsx from "clsx";
import { ReactNode, useState } from "react";

type Props = {
  summary: string;
  children: ReactNode;
};
export default function Details(props: Props) {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!open);
  return (
    <div>
      <button
        onClick={toggleOpen}
        className="w-full cursor-pointer text-xs items-center flex mb-4 focus:outline-none  text-gray-200 font-medium"
      >
        <span>{props.summary}</span> &nbsp;
        {open ? (
          <svg
            className="ml-auto"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
          </svg>
        ) : (
          <svg
            className="ml-auto"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none"></path>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
          </svg>
        )}
      </button>
      <div className={clsx({ hidden: !open })}>{props.children}</div>
    </div>
  );
}
