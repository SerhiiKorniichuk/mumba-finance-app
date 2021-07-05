import axios from "axios";
import { authDataGet } from "./helpers/AuthUtils";
const auth = authDataGet();

export default axios.create({
  baseURL: `https://mumba.finance/api/v1/`,
  headers: {
    "Content-Type": "application/json",
    "access-token": auth.accessToken,
  },
});
