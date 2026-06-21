import axios from "axios";
import { API_BASE_URL } from "./api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.warn(
        `API Connection Failed: Ensure the C# backend API server is running at ${API_BASE_URL}. Falling back to client-side mock data...`
      );
    }
    return Promise.reject(error);
  }
);
