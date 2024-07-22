import axios from "axios";
import { API_URL } from "./constants";

const getConfig = () => ({
  headers: { "auth-token": sessionStorage.getItem("USER_TOKEN") },
});

const FileService = {
  retrieveFiles: async () => {
    const config = getConfig();
    const res = await axios.get(`${API_URL}/file`, config);
    return res;
  },
  uploadFile: async (file) => {
    const user = JSON.parse(sessionStorage.getItem("USER"));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("owner", user._id);

    const config = {
      headers: {
        "auth-token": sessionStorage.getItem("USER_TOKEN"),
        "content-type": "multipart/form-data",
      },
    };
    const res = await axios.post(`${API_URL}/file/upload`, formData, config);
    return res;
  },
  shareFile: async (fileId, userList) => {
    const config = getConfig();
    const res = await axios.patch(
      `${API_URL}/file/share/${fileId}`,
      userList,
      config
    );
    return res;
  },
  unShareFile: async (fileId) => {
    const config = getConfig();
    const res = await axios.patch(`${API_URL}/file/unshare/${fileId}`, {}, config);
    return res;
  },
  updateFile: async (fileId, fileName) => {
    const config = getConfig();
    const res = await axios.patch(
      `${API_URL}/file/update/${fileId}`,
      { name: fileName },
      config
    );
    return res;
  },
  retrieveSharedUser: async (fileId) => {
    const config = getConfig();
    const res = await axios.get(`${API_URL}/file/share/${fileId}`, config);
    return res;
  },
  deleteFile: async (fileId) => {
    const config = getConfig();
    const res = await axios.delete(`${API_URL}/file/delete/${fileId}`, config);
    return res;
  },
};

export default FileService;
