import { AxiosError } from "axios";
import { useState } from "react";
import { mutate as mutateSwr } from "swr";

export default function useMutation<Params = any, Result = any>(
  fn: (...params: Params[]) => Promise<Result>,
  keysToInvalidate?: string[],
  options?: {
    onSuccess?: (value: Result) => void;
    onError?: (error: any) => void;
  }
) {
  const [loading, setLoading] = useState(false);

  const mutate = (...params: Params[]) => {
    setLoading(true);
    return fn(...params)
      .then((v) => {
        setLoading(false);
        options?.onSuccess?.(v);
      })
      .then(() => {
        if (keysToInvalidate) keysToInvalidate.forEach((s) => mutateSwr(s));
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        options?.onError?.(error.response?.data);
      });
  };
  return [mutate, { loading }] as const;
}
