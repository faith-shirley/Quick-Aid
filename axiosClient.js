import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    // On FulFilled
    return response;
  },
  (error) => {
    // On Rejected
    const { response } = error;
    if (response.status === 401) {
      localStorage.clear();
    }
    throw error;
  }
);

export default axiosClient;
