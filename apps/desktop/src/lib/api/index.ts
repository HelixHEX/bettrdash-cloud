import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_URL, SESSIONID } from "./constants";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${SESSIONID ?? ""}`,
  },
});

api.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  (error) => {
    const location = useLocation();
    const authPage =
      location.pathname.includes("login") ||
      location.pathname.includes("signup");
    if (error.response.status === 401) {
      if (!authPage) {
        return alert(window.location.pathname);
      }
      // window.locatoin"login"
    }

    return Promise.reject(error);
  },
);

export { api };
