import express from "express";
import authRoute from "./api/AuthorizeRoute.js";
import userRoute from "./api/UserRoute.js";
import fileRoute from "./api/FileRoute.js";
import downloadRoute from "./api/DownloadRoute.js";

const router = express.Router();

router.use("/", authRoute);
router.use("/user", userRoute);
router.use("/file", fileRoute);
router.use("/storage", downloadRoute);

export default router;
