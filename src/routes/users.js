import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { USERS } from "../Models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const user = await USERS.findOne({ email: email });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userNew = await USERS.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: userNew._id }, process.env.JWT_SECRET);

  res 
    .status(201)
    .json({ message: "user created successfully", token, userID: userNew._id });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const user = await USERS.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "No user with this email exists" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res
    .status(200)
    .json({ message: `Welcome ${user.username}`, token, userID: user._id });
});

router.post("/me", async (req, res) => {
  const {userID} = req.body;

  const user = await USERS.findById(userID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else return res.status(200).json(user);
});

export { router as userRouter };
 