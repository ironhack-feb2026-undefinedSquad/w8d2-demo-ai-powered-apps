const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Recipe = require("../models/Recipe.model");



//  POST /api/recipes  -  Creates a new recipe
router.post("/recipes", isAuthenticated, (req, res, next) => {
  const newRecipe = req.body;

  Recipe.create(newRecipe)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating a recipe \n\n", err);
      res.status(500).json({message: "Error creating a recipe"})
    });
});


//  GET /api/recipes -  Retrieves all of the recipes
router.get("/recipes", isAuthenticated, (req, res, next) => {
  Recipe.find()
    .then((allRecipes) => res.json(allRecipes))
    .catch((err) => {
      console.log("Error getting the list of recipes \n\n", err);
      res.status(500).json({message: "Error getting the list of recipes"})
    });
});


//  GET /api/recipes/:recipeId -  Retrieves a specific recipe by id
router.get("/recipes/:recipeId", isAuthenticated, (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findById(recipeId)
    .then((recipe) => res.status(200).json(recipe))
    .catch((err) => {
      console.log("Error getting the recipe details \n\n", err);
      res.status(500).json({message: "Error getting the recipe details"})
    });
});


// PUT  /api/recipes/:recipeId  -  Updates a specific recipe by id
router.put("/recipes/:recipeId", isAuthenticated, (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
    .then((updatedRecipe) => res.json(updatedRecipe))
    .catch((err) => {
      console.log("Error updating the recipe \n\n", err);
      res.status(500).json({message: "Error updating the recipe"})
    });
});


// DELETE  /api/recipes/:recipeId  -  Deletes a specific recipe by id
router.delete("/recipes/:recipeId", isAuthenticated, (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findByIdAndRemove(recipeId)
    .then(() =>
      res.json({
        message: `Recipe with ${recipeId} is removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("Error deleting the recipe \n\n", err);
      res.status(500).json({message: "Error deleting the recipe"})
    });
});


module.exports = router;
