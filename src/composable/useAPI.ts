import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserSession } from "/@src/stores/userSession";
import { useNotyf } from "/@src/composable/useNotyf";
import { useRouter } from "vue-router"; // Move useRouter import here

const { VITE_API_BASE_URL } = import.meta.env;

interface CustomAxiosInstance extends AxiosInstance {}

let api: CustomAxiosInstance | null = null;

function createApi(): CustomAxiosInstance {
  const userSession = useUserSession();
  const router = useRouter(); // Initialize router within createApi function
  const notyf = useNotyf(); // Initialize notyf within createApi function

  const axiosInstance = axios.create({
    baseURL: VITE_API_BASE_URL || "https://api.ibexworkhub.com/",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Token ${userSession.token}`;
    // config.headers.Authorization = `Token e47772f827463cd45fabc0dfd8ecf2c99bd90ab5`;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        userSession.logoutUser();
        router.push("/auth/login");
      }
      notyf.error("Unauthorized Request !");
      return Promise.reject(error);
    }
  );

  return axiosInstance as CustomAxiosInstance;
}

export function useApi(): CustomAxiosInstance {
  if (!api) {
    api = createApi();
  }
  return api;
}
