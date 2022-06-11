import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import { Item, Scene } from "../store";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function getMiniGames() {
  const { data, error } = useSWR<Item[], AxiosError>("/api/miniGames", fetcher);
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function updateMiniGame(body: any) {
  await axios.post("/api/miniGames", body);
  mutate("/api/miniGames");
}
