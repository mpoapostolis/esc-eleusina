import clsx from "clsx";
import React from "react";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../Hooks/useClickOutside";

type Props = {
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  stayOpen?: boolean;
  width?: string;
  position?: "left" | "right";
  showClose?: boolean;
  maxHeight?: string;
  onClose?: (e?: any) => void;
};

export default function Popover(props: Props) {
  const divRef = useRef(null);
  const clickOutside = useClickOutside(divRef.current);
  const [open, setOpen] = useState(false);

  function togglePopOver() {
    setOpen(!open);
  }

  useEffect(() => {
    setOpen(false);
    if (open && clickOutside) props?.onClose?.();
    // @ts-ignore
  }, [clickOutside, props.stayOpen]);
  const pos = props.position ?? "left";

  return (
    <div ref={divRef} className="relative w-full">
      <div className={`cursor-pointer`} onClick={togglePopOver}>
        {props.label}
      </div>
      {open && (
        <div
          onClick={() => !props.stayOpen && togglePopOver()}
          className={clsx(
            `${pos}-0`,
            props.width ?? "w-full",
            "absolute w-full border-gray-600 border shadow overflow-y-auto  -md mt-1  z-50 "
          )}
        >
          {props.showClose && (
            <button
              onClick={togglePopOver}
              className="absolute select-none right-0 top-0 mt-2 mr-2 text-xs "
            >
              <span role="img" aria-label="close">
                ✖️
              </span>
            </button>
          )}
          {props.children}
        </div>
      )}
    </div>
  );
}
