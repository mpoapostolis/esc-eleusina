import clsx from "clsx";
import { HTMLProps } from "react";

export function Input(
  props: HTMLProps<HTMLInputElement> & {
    label: string;
    disabled?: boolean;
  }
) {
  const { label, disabled, ...rest } = props;
  return (
    <div
      className={clsx("form-control w-full", {
        "opacity-60": props.disabled,
      })}
    >
      <label className="label">
        <span className="label-text">{props.label}</span>
      </label>
      <input
        disabled={disabled}
        type="text"
        {...rest}
        className={clsx("input input-bordered w-full", props.className)}
      />
    </div>
  );
}
