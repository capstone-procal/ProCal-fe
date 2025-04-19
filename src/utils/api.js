import axios from "axios";

const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;

const api = axios.create({
  baseURL: LOCAL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (request) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    console.log("Starting Request", request);
    return request;
  },
  (error) => {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error.response?.data || error;
    console.log("RESPONSE ERROR", err);
    return Promise.reject(err);
  }
);

export default api;