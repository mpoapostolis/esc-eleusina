// getVehicles with useSwr

import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { Reward } from "../../pages";
import Id from "../../pages/api/items/[id]";
import { useStore } from "../../store";
import { fetcher } from "../utils";
import { ACHIEVEMENT, Item } from "./types";

export function useInventory() {
  const store = useStore();
  const { data, error } = useSWR<Item[], AxiosError>(
    `/api/inventory?scene=${store.scene}`,
    fetcher
  );
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAchievements() {
  const { data, error } = useSWR<ACHIEVEMENT[], AxiosError>(
    `/api/inventory?epic=true`,
    fetcher
  );
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

export async function updateInv(itemId: string, payload: Record<string, any>) {
  if (itemId) await axios.put(`/api/inventory?itemId=${itemId}`, payload);
}

export async function addReward(reward: Reward) {
  const { _id, ...rest } = reward;
  await axios.post("/api/inventory?epic=true", {
    ...rest,
    rewardId: _id,
    scene: "intro",
    isEpic: true,
  });
}
