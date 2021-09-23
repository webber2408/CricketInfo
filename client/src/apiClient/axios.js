import axios from "axios";
import { BASE_URL } from "./httpConfig";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "cache-control": "no-cache",
  },
});
