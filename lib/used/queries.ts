// getVehicles with useSwr

import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { Reward } from "../../pages/game";
import { useStore } from "../../store";
import { fetcher } from "../utils";
import { Used } from "./types";

export function useUsed() {
  const store = useStore();
  const { data, error } = useSWR<Used[], AxiosError>(
    `/api/used?scene=${store.scene}`,
    fetcher
  );
  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}



