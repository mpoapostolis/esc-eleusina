// getVehicles with useSwr

import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { User } from "./types";

export function useUser() {
  const { data, error } = useSWR<User, AxiosError>(`/api/auth`, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function login(userName: string, password: string) {
  const data = await axios.post("/api/auth?type=login", {
    userName,
    password,
  });

  return {
    data: data,
  };
}

export async function register(
  userName: string,
  password: string,
  passwordConfirmation: string
) {
  const data = await axios.post("/api/auth?type=register", {
    userName,
    password,
    passwordConfirmation,
  });

  return {
    data: data,
  };
}

export async function updateUser(obj: Record<string, any>) {
  await axios.put("/api/auth", obj);
}
