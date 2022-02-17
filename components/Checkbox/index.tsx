import clsx from "clsx";
import { HTMLProps } from "react";

type Props = {
  label: string;
  onClick?: () => void;
} & HTMLProps<HTMLInputElement>;
export default function Checkbox(props: Props) {
  return (
    <div
      onClick={(evt) => {
        evt.stopPropagation();
        if (props.onClick) props?.onClick();
      }}
      title={props.label}
      className={clsx(props.className, "flex items-center")}
    >
      <div className="min-w-max  flex items-center">
        <div
          className={clsx(
            { "bg-blue-500": props.checked },
            { "bg-gray-100 border-2": !props.checked },
            " w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2"
          )}
        >
          <svg
            className="fill-current  w-3 h-3 text-white pointer-events-none"
            viewBox="0 0 20 20"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </div>
      </div>
      <label
        htmlFor={props.label}
        className="cursor-pointer text-sm select-none truncate text-gray-300"
      >
        {props.label}
      </label>
    </div>
  );
}
