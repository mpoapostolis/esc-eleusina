import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function Range(
  props: { label: string } & DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const { label, ...rest } = props;
  return (
    <div className="relative pt-1">
      <label htmlFor="customRange1" className="form-label text-sm">
        {label}
      </label>
      <div className="absolute pointer-events-none h-1 w-full bottom-4 bg-blue-500"></div>
      <input
        {...rest}
        type="range"
        className="z-50 form-range appearance-none w-full h-7 p-0 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none"
        id="customRange1"
      />
    </div>
  );
}
