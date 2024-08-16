import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserSession } from "../stores/user-session";
import { error } from "console";

const url = "https://vecel-practice.vercel.app";

interface CustomAxiosInstance extends AxiosInstance {}
const userSession = useUserSession();

let api: CustomAxiosInstance | null = null;

function createApi(): CustomAxiosInstance {
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    if (userSession.isLoggedIn) {
      config.headers.Authorization = `Bearer ${userSession.token}`;
    } else if (userSession.code) {
      config.headers.Authorization = userSession.code;
    }
    return config;
  });
  return axiosInstance as CustomAxiosInstance;
}

export function useApi(): CustomAxiosInstance {
  if (!api) {
    api = createApi();
  }
  return api;
}
