import axios from "axios";

const axiosSecure = axios.create({
  // baseURL: "https://pet-adaption-server.vercel.app",
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosSecure;
