import express from "express";
import auth from "../helpers/tokenVerifier.js";
import Encryption from "bcryptjs";
import formValidate from "../helpers/validator.js";
import User from "../models/User.js";
import momentConfig from "../momentConfig.js";

const router = express.Router();

const SALT_LENGTH = 10;

let user;
let now = momentConfig.getCurrentDateTime();

// @route GET /user/all
// @desc Get All other users to share
router.get("/all", auth, async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json({
      status: "success",
      data: allUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route GET /user/allEmail
// @desc Get All email other users to share
router.get("/allEmail", auth, async (req, res) => {
  try {
    const allUser = await User.find({ _id: { $ne: req.user._id } }).select(
      "email"
    );
    res.status(200).json({
      status: "success",
      data: allUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route GET /user/info
// @desc Return the current user info
router.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route POST /user/addNewUser
// @desc Register a new user
router.post("/addNewUser", auth, async (req, res) => {
  const { error } = await formValidate(req.body, "registration");
  if (error)
    return res
      .status(500)
      .json({ status: "error", message: error.details[0].message });

  const userExist = await User.findOne({ email: req.body.email });
  if (userExist)
    return res
      .status(500)
      .json({ status: "error", message: "Email already exist!" });

  if (req.body.password !== req.body.confirmPassword)
    return res
      .status(500)
      .json({ status: "error", message: "Passwords don't match!" });

  const salt = Encryption.genSaltSync(SALT_LENGTH);
  const hashedPassword = Encryption.hashSync(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    status: "Active",
    createdAt: now,
    updatedAt: now,
  });

  try {
    const savedUser = await user.save();

    res.json({
      status: "success",
      message: "Registration successfully!",
      data: {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /user/passwordChange/{userId}
// @desc Edit user password
router.patch("/passwordChange/:userId", auth, async (req, res) => {
  const { error } = await formValidate(req.body, "passwordChange");
  const userId = req.params.userId;
  const { password, confirmPassword } = req.body;
  try {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: error.details[0].message });

    if (password !== confirmPassword)
      return res.status(500).json({
        status: "error",
        message: "Passwords don't match!",
      });

    const salt = Encryption.genSaltSync(SALT_LENGTH);
    const hashedPassword = Encryption.hashSync(req.body.password, salt);

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword, updatedAt: now } }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User status updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /user/update/{userId}
// @desc Edit user info
router.patch("/update/:userId", auth, async (req, res) => {
  const { error } = await formValidate(req.body, "editUser");
  const userId = req.params.userId;
  const { name, status } = req.body;
  try {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: error.details[0].message });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { name: name, status: status, updatedAt: now } }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route PATCH /user/status/{userId}
// @desc Edit user status
router.patch("/status/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  const { status } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { status: status, updatedAt: now } }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User status updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

// @route DELETE /user/delete/{userId}
// @desc Delete a user
router.delete("/delete/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const removedUser = await User.findOneAndDelete({
      _id: userId,
    });

    if (!removedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

export default router;
