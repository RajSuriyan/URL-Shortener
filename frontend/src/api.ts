import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  withCredentials: true,
  
});

api.interceptors.request.use((config) => {
  const csrf = Cookies.get("csrftoken");
  console.log(csrf)
  console.log(Cookies.get("accessToken"))
  config.withCredentials =true;

  if (csrf) {
    
    config.headers["X-CSRF-Token"] = csrf;
  }
  return config;
});

export default api;


