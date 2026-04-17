import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // for cookies (VERY IMPORTANT)
});

export default API;
