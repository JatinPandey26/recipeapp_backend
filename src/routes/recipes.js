import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middleware/verifyJWT.js";
import { RECIPE } from "../Models/Recipes.js";
import { USERS } from "../Models/Users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const recipes = await RECIPE.find();
    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post("/create-recipe", verifyToken, async (req, res) => {
  try {
    const { name, ingredients, instructions, image, cookingTime, createdBy } =
      req.body;

    if (
      !name ||
      !ingredients ||
      !instructions ||
      !image ||
      !cookingTime ||
      !createdBy
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const recipe = await RECIPE.create({
      name: name,
      ingredients: ingredients,
      instructions: instructions,
      image: image,
      cookingTime: cookingTime,
      createdBy: createdBy,
    });

    return res
      .status(200)
      .json({ message: "recipe created successfully", recipe });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.put("/save-recipe", verifyToken, async (req, res) => {
  const { userID, recipeID } = req.body;

  try {
    const user = await USERS.findById(userID);
    const recipe = await RECIPE.findById(recipeID);

    user.savedRecipes.push(recipe);
    await user.save();
    return res.status(200).json({
      message: "recipe saved successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/savedRecipes/ids", verifyToken, async (req, res) => {
  try {
    const user = await USERS.findById(req.body.userID);
    return res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/savedRecipes", verifyToken, async (req, res) => {
  try {
    const user = await USERS.findById(req.body.userID);
    const savedRecipes = await RECIPE.find({
      _id: { $in: user?.savedRecipes }, // inside the array
    });
    return res.status(200).json(savedRecipes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/remove-saved-recipe", verifyToken, async (req, res) => {
  const { userID, recipeID } = req.body;

  const user = await USERS.findById(userID);

  let savedRecipes = user.savedRecipes;
  let recipeIDObject = new mongoose.mongo.ObjectId(String(recipeID));
 
  savedRecipes = savedRecipes.filter(
    (recipe) => recipe.toString() !== recipeIDObject.toString()
  );

  user.savedRecipes = savedRecipes;

  await user.save();

  return res.status(200).json({ message: "recipe removed successfully" });
});

export { router as recipesRouter };
