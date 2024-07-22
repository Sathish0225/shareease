import axios from "axios";
import { API_URL } from "./constants";

const AuthService = {
  register: async (name, email, password, confirmPassword) => {
    let res = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      confirmPassword,
    });

    let { status, data } = res;

    if (status === 200) {
      AuthService.setupAxiosConfigure(data.data);
    }

    return res;
  },
  login: async (email, password) => {
    let res = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    let { status, data } = res;

    if (status === 200) {
      AuthService.setupAxiosConfigure(data.data);
    }

    return res;
  },
  setupAxiosConfigure: (data) => {
    const { token, id, user } = data;
    if (token && id && user) {
      sessionStorage.setItem("USER_TOKEN", token);
      sessionStorage.setItem("USER", JSON.stringify(user));
      axios.defaults.headers.common["auth-token"] =
        sessionStorage.getItem("USER_TOKEN");
    }
  },
  currentUser: () => {
    return sessionStorage.getItem("USER");
  },
  isUserLoggedIn: () => {
    let token = sessionStorage.getItem("USER_TOKEN");
    return !!token;
  },
  logout: () => {
    sessionStorage.removeItem("USER_TOKEN");
    sessionStorage.removeItem("USER");
    delete axios.defaults.headers.common["auth-token"];
  },
};
export default AuthService;
