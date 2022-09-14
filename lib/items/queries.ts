import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import { Img } from "../../pages/admin";
import { useStore } from "../../store";
import { fetcher } from "../utils";
import { Item } from "./types";

export function useItems(scene?: string) {
  const store = useStore();
  const { data, error } = useSWR<Item[], AxiosError>(
    `/api/items?scene=${scene ?? store.scene}`,
    fetcher
  );
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
export async function updateItem(id: string, body: any) {
  await axios.put(`/api/items/${id}`, body);
  mutate("/api/items");
}

export async function deleteItem(id?: string) {
  return id && (await axios.delete(`/api/items/${id}`));
}

export async function addItem(props: Partial<Item>) {
  const d = await axios.post<Item>("/api/items", {
    ...props,
    scale: 0.5,
  });
  return d.data;
}

export const invalidateItems = () => {
  mutate(`/api/items`);
};

export function useLibrary() {
  const { data, error } = useSWR<Img[], AxiosError>("/api/library", fetcher);
  mutate("/api/items");

  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useMiniGames() {
  const { data, error } = useSWR<Item[], AxiosError>("/api/miniGames", fetcher);
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
