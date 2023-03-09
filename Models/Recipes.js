import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  image: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  createdBy : { type: mongoose.Schema.Types.ObjectId, ref: "USERS", required: true}
});

export const RECIPE = mongoose.model("RECIPES", RecipeSchema);
