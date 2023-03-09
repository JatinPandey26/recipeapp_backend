import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      next();
    });
  } else {
    res
      .status(401)
      .json({ message: "No token found , try login / register again" });
  }
};


