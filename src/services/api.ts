import axios from "axios";

// Connect to the Python Flask backend running on port 5000
const API = axios.create({
  baseURL: "https://pop-b.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
