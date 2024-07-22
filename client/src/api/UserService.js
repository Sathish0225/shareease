import axios from "axios";
import { API_URL } from "./constants";

const getConfig = () => ({
  headers: { "auth-token": sessionStorage.getItem("USER_TOKEN") },
});

const UserService = {
  getAllUser: async () => {
    const config = getConfig();
    let res = await axios.get(`${API_URL}/user/all`, config);
    return res;
  },
  getAllEmail: async () => {
    const config = getConfig();
    let res = await axios.get(`${API_URL}/user/allEmail`, config);
    return res;
  },
  getUserInfo: async () => {
    const config = getConfig();
    let res = await axios.get(`${API_URL}/user/info`, config);
    return res;
  },
  addNewuser: async (name, email, password, confirmPassword) => {
    const config = getConfig();
    let res = await axios.post(
      `${API_URL}/user/addNewUser`,
      {
        name,
        email,
        password,
        confirmPassword,
      },
      config
    );
    return res;
  },
  edituser: async (userId, name) => {
    const config = getConfig();
    let res = await axios.patch(
      `${API_URL}/user/update/${userId}`,
      { name },
      config
    );
    return res;
  },
  deleteUser: async (userId) => {
    const config = getConfig();
    const res = await axios.delete(`${API_URL}/user/delete/${userId}`, config);
    return res;
  },
};

export default UserService;
