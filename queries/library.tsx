import { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import { fetcher } from ".";
import { Img } from "../pages/admin";

export function getLibrary() {
  const { data, error } = useSWR<Img[], AxiosError>("/api/library", fetcher);
  mutate("/api/items");

  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
