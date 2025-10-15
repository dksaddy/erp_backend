import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token is in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (without password) to req
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
