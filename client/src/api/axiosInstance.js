// import axios from 'axios';
// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ Vite uses import.meta.env
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authorized = JSON.parse(localStorage.getItem("authorized"));
      if (authorized && authorized.isAuthenticated) {
        // dispatch logout action
        localStorage.removeItem("authorized");
        // redirect to login page if needed
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
