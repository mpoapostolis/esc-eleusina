import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function Range(
  props: { label: string } & DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const { label, ...rest } = props;
  return (
    <div className="">
      <label className="label label-text">{label}</label>
      <input
        {...rest}
        type="range"
        className="range range-sm"
        id="customRange1"
      />
    </div>
  );
}
