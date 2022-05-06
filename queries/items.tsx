import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import { fetcher } from ".";
import { Item, Scene } from "../store";

export function getItems(s?: Scene) {
  const { data, error } = useSWR<Item[], AxiosError>("/api/items", fetcher);
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

export async function deleteItem(id: string) {
  await axios.delete(`/api/items/${id}`);
  mutate("/api/items");
}

export async function addItem(props: { scene: Scene; imgId: string }) {
  const d = await axios.post<Item>("/api/items", {
    ...props,
    scale: 0.5,
  });
  mutate("/api/items");
  return d.data;
}
