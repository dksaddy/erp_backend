import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    { id: userId, role },        // Payload
    process.env.JWT_SECRET,      // Secret key
    { expiresIn: "1d" }          // Token expiration
  );
};
