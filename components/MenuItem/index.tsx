import { HTMLProps } from "react";

export default function MenuItem(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      role="button"
      {...props}
      className={`
                  text-shadow border cursor-pointer border-gray-400 bg-black bg-opacity-70 
                  text-center flex justify-center items-center h-20 text-gray-500
                  rounded-md text-3xl hover:underline  duration-150 font-bold shadow-lg 
                  ${props.className}`}
    >
      <div className="flex items-center w-64 gap-x-2">
        <img
          className="w-10 h-10 mr-10"
          src={props.src}
          width="32"
          height="32"
        />
        <span className="">{props.title}</span>
      </div>
    </div>
  );
}
