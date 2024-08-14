import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ares-elite-backend.vercel.app/",
  // baseURL: "http://localhost:5000",

  // baseURL: "https://ares.adaptable.app/",
  // baseURL: "https://ares-doctor.vercel.app",
});

export default axiosInstance;
