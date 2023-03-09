import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { userRouter } from "./routes/users.js"; 
import { recipesRouter } from "./routes/recipes.js";
import { adminRouter } from "./routes/admin.js";
const app = express();

dotenv.config({ path: `./config.env` });
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use("/admin", adminRouter);

app.listen(3001, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});

// username - jatin26pandey | password = recipeapp123
