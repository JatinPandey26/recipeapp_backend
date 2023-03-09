import express from "express";
import { verifyToken } from "../middleware/verifyJWT.js";
import { USERS } from "../Models/Users.js";
const router = express.Router();

router.post("/get-all-users", verifyToken, isAdmin, async (req, res) => {
  try {  
    const users = await USERS.find({ role: { $ne: "admin" } });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  } 
});

export { router as adminRouter };

export async function isAdmin(req, res, next) {
  const { userID } = req.body;

  const user = await USERS.findById(userID);
  if (user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
