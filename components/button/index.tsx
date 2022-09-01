import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export function Button(
  p: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
) {
  const { children, loading, className, ...rest } = p;
  const spinner = {
    "opacity-0": !loading,
  };

  const child = {
    "opacity-40": loading,
  };
  return (
    <button {...rest} className={className}>
      <span
        className={clsx(
          "animate-spin absolute rounded-full h-4 w-4 border-b-2  border-white",
          spinner
        )}
      />
      <span className={clsx(child)}>{children}</span>
    </button>
  );
}
