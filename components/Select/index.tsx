import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import Popover from "../Popover";

type Option = {
  src?: string;
  value: string | number | undefined | null;
  label: string;
};
type Props = {
  className?: string;
  placeholder?: string;
  options: Option[];
  label: ReactNode;
  icon?: ReactNode;
  onChange?: (o: Option) => void;
  value?: string | undefined;
  error?: string;
};

export default function Select(props: Props) {
  const [internalError, setInternalError] = useState<string>();
  const onSelect = (opt: Option) => {
    if (internalError) setInternalError(undefined);
    if (props.onChange) props.onChange(opt);
  };

  useEffect(() => {
    setInternalError(props.error);
  }, [props.error]);

  const getLabel = () =>
    props?.options?.find((opt) => String(opt.value) === String(props?.value))
      ?.label ?? (
      <span className="text-gray-500">{props.placeholder ?? ""}</span>
    );

  return (
    <Popover
      label={
        <div className={props.className}>
          {!props.placeholder && (
            <label className="block text-left text-xs font-medium text-gray-200">
              {props.label}
            </label>
          )}
          <div
            className={clsx("relative", {
              "mt-2": !props.placeholder,
            })}
          >
            <div
              className={clsx(
                "relative border select-none h-9 w-full  md shadow-sm  pr-10 py-2 text-left cursor-default focus:outline-none sm:text-sm",
                {
                  "border-gray-500": !internalError,
                  "border-red-300": internalError,
                }
              )}
            >
              {internalError ? (
                <span className="text-red-300 pl-3">{internalError}</span>
              ) : (
                <div className="relative">
                  <img
                    className={clsx("absolute left-0 ml-2", {
                      hidden: !props.icon,
                    })}
                    width="20"
                    height="20"
                    src={props.icon?.toString()}
                  />

                  <div
                    className={clsx({
                      "pl-9": props.icon,
                      "pl-3": !props.icon,
                    })}
                  >
                    {getLabel()}
                  </div>
                </div>
              )}
            </div>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      }
    >
      <ul
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-item-3"
        className=" py-1 max-h-96 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        {props?.options?.length ? (
          props?.options?.map((opt) => (
            <li
              tabIndex={0}
              key={opt.label}
              onClick={() => onSelect(opt)}
              className="text-gray-200 flex items-center m-0 border-gray-500 bg-black  hover:bg-slate-900  focus:outline-none  cursor-default select-none relative py-2 pl-3"
            >
              {opt.src && (
                <img alt="" className="w-10 p-1 mr-4 h-10" src={opt.src} />
              )}
              <span className="block font-normal truncate">{opt.label}</span>
            </li>
          ))
        ) : (
          <li
            tabIndex={0}
            className="text-gray-400 focus:outline-none bg-black focus:bg-gray-100 cursor-default select-none relative py-2 pl-3"
          >
            <div className="flex items-center">
              <span className="block font-normal truncate">
                Δεν βρέθηκαν αποτελέσματα
              </span>
            </div>
          </li>
        )}
      </ul>
    </Popover>
  );
}
