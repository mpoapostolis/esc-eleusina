// getVehicles with useSwr

import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Item } from "./types";

export function useInventory() {
  const { data, error } = useSWR<Item[], AxiosError>(`/api/inventory`, fetcher);
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function addItem(itemId?: string) {
  if (itemId)
    await axios.post("/api/inventory", {
      itemId,
    });
}
