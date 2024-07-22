import express from "express";
import Encryption from "bcryptjs";
import formValidate from "../helpers/validator.js";
import momentConfig from "../momentConfig.js";
import Token from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const SALT_LENGTH = 10;

let now = momentConfig.getCurrentDateTime();

// @route GET /
// @desc Test route
router.get("/", (req, res) => res.send("Authorize route"));

//  @route POST /register
// @desc Handle registration
router.post("/register", async (req, res) => {
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
    const token = Token.sign({ _id: savedUser._id }, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.json({
      status: "success",
      message: "Registration successfully!",
      data: {
        token: token,
        id: user._id,
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

//  @route POST /login
// @desc Authenticate the login and return JWT token
router.post("/login", async (req, res) => {
  const { error } = await formValidate(req.body, "login");
  if (error)
    return res
      .status(500)
      .json({ status: "error", message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(500)
      .json({ status: "error", message: "Email don't match our records!" });

  const validPassword = await Encryption.compare(
    req.body.password,
    user.password
  );
  if (!validPassword)
    return res
      .status(500)
      .json({ status: "error", message: "Password don't match our records!" });

  const token = Token.sign({ _id: user._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.json({
    status: "success",
    message: "Login successfully!",
    data: {
      token: token,
      id: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

export default router;
