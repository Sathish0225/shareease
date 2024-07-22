import express from "express";
import auth from "../helpers/tokenVerifier.js";
import File from "../models/File.js";
import _ from "lodash";
import path from "path";
import { fileURLToPath } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route GET /storage/{user}/{file}
// @desc Download the file - only shared or owned can download.
router.get("/:user/:file", auth, async (req, res) => {
  const fileLocation = path.join("storage", req.params.user, req.params.file);
  try {
    const downloadFile = await File.findOne({ download: fileLocation });
    if (!downloadFile) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found" });
    }
    if (
      _.includes(downloadFile.shared, req.user._id) ||
      downloadFile.owner == req.user._id
    ) {
      const fullPath = path.join(__dirname, "..", downloadFile.download);
      res.download(fullPath, downloadFile.name);
    } else {
      res
        .status(403)
        .json({ status: "error", message: "You don't have permission" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
