import express from "express";
import auth from "../helpers/tokenVerifier.js";
import multer from "multer";
import fs from "fs";
import User from "../models/User.js";
import File from "../models/File.js";
import crypto from "crypto";
import validFilename from "valid-filename";
import _ from "lodash";
import momentConfig from "../momentConfig.js";
import path from "path";
import { fileURLToPath } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let user;
let now = momentConfig.getCurrentDateTime();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./storage";
    !fs.existsSync(`${dir}/${req.user._id}`) &&
      fs.mkdirSync(`${dir}/${req.user._id}`);
    cb(null, "./storage/" + req.user._id);
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(20).toString("hex"));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

// @route GET /file/
// @desc Return the current user files
router.get("/", auth, async (req, res) => {
  const user = req.user;

  try {
    const myFiles = await File.find({ owner: user._id });
    const sharedWithMe = await File.find({ shared: { $in: [user._id] } });

    const totalFile = [
      ...new Set([
        ...myFiles.map((file) => file._id),
        ...sharedWithMe.map((file) => file._id),
      ]),
    ];

    res.status(200).json({
      status: "success",
      data: {
        myFiles: myFiles,
        sharedWithMe: sharedWithMe,
        total: totalFile,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /file/share/{fileId}
// @desc Share file with other people.
router.patch("/share/:fileId", auth, async (req, res) => {
  const fileId = req.params.fileId;
  const selectedUsers = req.body;

  try {
    const file = await File.findOneAndUpdate(
      { _id: fileId, owner: req.user._id },
      { $set: { shared: selectedUsers } }
    );
    if (selectedUsers.length > 0 && selectedUsers.length > file.shared.length) {
      for (user of selectedUsers) {
        let userIsLive = connectedUser[user];
        if (userIsLive)
          global.SocketIO.io.sockets.connected[userIsLive].emit(
            "subscribe",
            file._id
          );
      }
    } else if (selectedUsers.length < file.shared.length) {
      const removedUsers = _.xor(selectedUsers, file.shared);

      for (removeUser of removedUsers) {
        let userIsLive = connectedUser[removeUser];
        if (userIsLive)
          global.SocketIO.io.sockets.connected[userIsLive].emit(
            "unsubscribe",
            file._id
          );
      }
    } else {
      global.SocketIO.io.sockets.in(fileId).emit("unsubscribe", file._id);
    }
    res.status(200).json({
      status: "success",
      message: "File shared successfully",
      data: file,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /file/unshare/{fileId}
// @desc Unshare the file for yourself.
router.patch("/unshare/:fileId", auth, async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const file = await File.findOneAndUpdate(
      { _id: fileId, shared: { $in: [req.user._id] } },
      {
        $pull: { shared: { $in: [req.user._id] } },
      }
    );

    if (!file) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found" });
    }

    res.status(200).json({
      status: "success",
      message: "File unshared successfully",
      data: file,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /file/update/{fileId}
// @desc Edit file name
router.patch("/update/:fileId", auth, async (req, res) => {
  const fileId = req.params.fileId;
  const { name } = req.body;
  if (validFilename(name)) {
    try {
      const file = await File.findOneAndUpdate(
        { _id: fileId, owner: req.user._id },
        { $set: { name: name, date: Date.now(), updatedAt: Date.now() } }
      );

      if (!file) {
        return res.status(404).json({
          status: "error",
          message: "File not found",
        });
      }

      global.SocketIO.io.sockets.in(fileId).emit("update");

      res.status(200).json({
        status: "success",
        message: "File updated successfully",
        data: file,
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err });
    }
  } else {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route GET /file/share/{fileId}
// @desc Get the current shared users of a file
router.get("/share/:fileId", auth, async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const file = await File.findOne({ _id: fileId, owner: req.user._id });
    global.SocketIO.io.sockets.in(fileId).emit("update");

    res.status(200).json({
      status: "success",
      data: file.shared,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route POST /file/upload
// @desc Upload files to db
router.post("/upload", auth, upload.single("file"), async (req, res, next) => {
  const { email } = await User.findOne({ _id: req.user });

  const file = new File({
    name: req.file.originalname,
    owner: req.user._id,
    ownerEmail: email,
    download: req.file.path,
    size: req.file.size,
    createdAt: now,
    updatedAt: now,
  });

  try {
    const saveFile = await file.save();
    res.status(200).json({
      status: "success",
      message: "File Uploaded successfully",
      data: { saveFile },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route DELETE /file/delete/{fileId}
// @desc Delete a file
router.delete("/delete/:fileId", auth, async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const removedFile = await File.findOneAndDelete({
      _id: fileId,
      owner: req.user._id,
    });

    if (!removedFile) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", removedFile.download);
    console.log(filePath);

    fs.unlinkSync(filePath);
    global.SocketIO.io.sockets.in(fileId).emit("update");

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

export default router;
