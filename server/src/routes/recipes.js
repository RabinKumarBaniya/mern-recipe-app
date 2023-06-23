import express from 'express';
import mongoose from 'mongoose';
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await RecipesModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.post("/", async (req, res) => {
    const recipe = new RecipesModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

// save a recipe
router.put("/", async (req, res) => {
    try {
        const recipe = await RecipesModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        res.json(err);
    }
});


// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
        res.json(err);
    }
});


// Get Saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const savedRecipes = await RecipesModel.find({
            _id: { $in: user.savedRecipes },
        })
        res.json({ savedRecipes });
    } catch (err) {
        res.json(err);
    }
});



export { router as recipesRouter };

