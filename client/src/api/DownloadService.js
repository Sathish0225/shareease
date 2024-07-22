import axios from "axios";
import { API_URL } from "./constants";

const DownloadService = {
  downloadFile: async (fileURL) => {
    let res = await axios.get(`${API_URL}/${fileURL}`, {
      headers: {
        "auth-token": sessionStorage.getItem("USER_TOKEN"),
        "content-type": "multipart/form-data",
      },
      responseType: "blob",
    });
    return res;
  },
};

export default DownloadService;
