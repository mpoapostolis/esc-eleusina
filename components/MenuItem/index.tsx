import Link from "next/link";
import { Fragment } from "react";

export default function MenuItem(props: any) {
  const Comp = props.goTo ? Link : Fragment;
  return (
    <Comp href={props.goTo ?? "#"}>
      <button
        {...props}
        className={`grid grid-cols-[24px_1fr] justify-center items-center btn  w-full`}
      >
        <img className="w-6 h-fit" src={props.src} />
        <div className="text-center">{props.title}</div>
      </button>
    </Comp>
  );
}
