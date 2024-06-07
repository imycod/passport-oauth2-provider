import axios from "axios";

const request = axios.create({
    baseURL: "/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        client_id:"00001",
        response_type:"code",
    },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    if (err.response.status === 304) {
      localStorage.removeItem("access_token");
      const location = err.response.headers.location;
      console.log('err.response.headers---',err.response.headers);
      if (location) {
        window.location.href = location;
      }
    }
    return Promise.reject(err);
  }
);

export default request;
