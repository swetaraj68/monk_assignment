import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://stageapi.monkcommerce.app/task",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "72njgfa948d9aS7gs5",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error:", error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
