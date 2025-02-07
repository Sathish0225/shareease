import Token from "jsonwebtoken";

const tokenVerifier = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ status: "error", message: "Access Denied" });

  try {
    const verified = await Token.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ status: "error", message: "Invalid Token" });
  }
};

export default tokenVerifier;
