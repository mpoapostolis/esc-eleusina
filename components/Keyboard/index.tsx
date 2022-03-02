import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, useEffect } from "react";
import useKeyPress from "../../Hooks/useKeyPress";

const letters = [
  ";",
  "ς",
  "ε",
  "ρ",
  "τ",
  "υ",
  "θ",
  "ι",
  "ο",
  "π",
  "α",
  "σ",
  "δ",
  "φ",
  "γ",
  "η",
  "ξ",
  "κ",
  "λ",
  "ζ",
  "χ",
  "ψ",
  "ω",
  "β",
  "ν",
  "μ",
  "Backspace",
];

function Key(
  props: {
    special?: boolean;
    pressed: boolean;
  } & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  const { children, ...rest } = props;

  return (
    <button
      className={clsx(
        `border-gray-700 shadow-inner shadow-gray-500 bg-black 
          rounded-xl hover:scale-90 uppercase w-full border 
          p-3  font-black text-gray-300 duration-150`,
        {
          "bg-white bg-opacity-10 scale-90": props.pressed,
          "text-xs font-semibold": props.special,
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function Keyboard(props: { onKeyPress: (k: string) => void }) {
  const { key, keyPressed } = useKeyPress();
  useEffect(() => {
    if (key && letters.includes(key)) props.onKeyPress(key);
  }, [key]);

  return (
    <div className={clsx("w-full text-white font-black text-base")}>
      <div className="flex justify-center  gap-1 my-1 w-full">
        {["ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "Backspace"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            special={k === "Backspace"}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
      <div className="flex justify-center gap-1 my-1 w-full">
        {["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
      <div className="flex justify-center gap-1 my-1 w-full">
        {["ζ", "χ", "ψ", "ω", "β", "ν", "μ", "Enter"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            special={k === "Enter"}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
