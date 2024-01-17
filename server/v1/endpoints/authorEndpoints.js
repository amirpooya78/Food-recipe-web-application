'use strict';
const express = require('express');
const { Author } = require('../../models/AuthorModel.js');
const { User } = require('../../models/UserModel.js');
const { validateObjectId } = require('../../middlewares/ObjectIdMiddleware.js');
const { authentication } = require('../../middlewares/authentication.js');
const { Recipe } = require('../../models/RecipeModel.js');
const { Ingredient } = require('../../models/IngredientModel.js');
const asyncWrapper = require('../../middlewares/trycatchWrapper.js');

const router = express.Router();
router.use(express.json());

// HTTP Handlers

router.get('/', asyncWrapper(async (req, res) => {
    try{
        let authors = await Author.find().populate({path: 'user', select: '-password'});
    
        res.status(200).send(authors);
    } catch(err){
        res.status(500).send({message: 'Something failed'});
    }
}));

// id in case of autthor it is not autho's own id it's user's id.
router.get('/:userId', [authentication ,validateObjectId], asyncWrapper(async (req, res) => {

    let author = await Author.findOne({user: req.params.userId}).populate({path: 'user', select: '-password'});

    if(!author) return res.status(404).send({message: 'Author with given id was not found.'});
    
    res.status(200).send(author);
}));

router.get('/:id/published_recipes/:page', [validateObjectId], asyncWrapper(async (req, res) => {
    
    let result_per_page = 10;
    let page = parseInt(req.params.page);
    let pagination = result_per_page * (page - 1);
    
    let author = await Author.findById(req.params.id).populate({path: 'user', select: '-password'})
    .populate({path: 'published_recipes'});
    
    if(!author) return res.status(404).send({message: 'Author with given id was not found.'});
    
    author.published_recipes.sort((recipeA, recipeB) => {
        return recipeA.name.localeCompare(recipeB.name);
    })

    author.published_recipes = author.published_recipes.splice(pagination, pagination + result_per_page);
       
    res.status(200).send(author.published_recipes);
}));

router.get('/:id/published_recipes/:recipe_id', asyncWrapper(async (req, res) => {
    let author = await Author.findById(req.params.id).populate({path: 'user', select: '-password'})
    .populate({path: 'published_recipes'});
    if(!author) return res.status(404).send({message: 'Author with given id was not found.'});

    let recipe = author.published_recipes.find((published_recipe) => {
        return (published_recipe._id.toString() === req.params.recipe_id);
    })

    if (!recipe) return res.status(404).send({message: "No recipe was found in author's published recipes"})

    // Creating the HATEOAS
    const recipeWithLink = {
        recipeId: recipe._id,
        recipeName: recipe.name,
        links: [
            {
                href: `/authors/${req.params.id}/published_recipes/${req.params.recipe_id}/ratings`,
                rel: 'ratings',
                type: 'GET',
            },
        ],
    };
    res.status(200).send(recipeWithLink);
}));

router.post('/:userId/published_recipes', [authentication ,validateObjectId], asyncWrapper(async (req, res) => {

    let author = await Author.findOne({user: req.params.userId});
    if(!author) return res.status(404).send({message: 'Author with given id was not found.'});

    let ingredients = await req.body.list_of_ingredients.map(async (ing) => {
        let ingredientName = ing.ingredient.toString();
        
        let ingredient = await Ingredient.findOne({name: ingredientName});

        if(ingredient){
            return {ingredient: ingredient._id, quantity: parseFloat(ing.quantity)}
        }else{
            return res.status(400).send({message: `Bad requiest - Invalid ingredient: ${ingredientName}`});
        }
    });

    ingredients = await Promise.all(ingredients);

    let newRecipe = new Recipe(req.body);
    newRecipe.list_of_ingredients = ingredients;
    author.published_recipes.push(newRecipe);
    await author.save();

    let result = await newRecipe.save();

    res.status(201).json(result);
}));

router.delete('/:id/published_recipes/:recipe_id',  asyncWrapper(async (req, res) => {

    let author = await Author.findById(req.params.id);
    if(!author) return res.status(404).send({message: "Author with given id was not found."});

    let result = await Recipe.findByIdAndRemove(req.params.recipe_id);
    if (!result) {
        return res.status(404).send({message: "Recipe with given id was not found."});
    }
    else{
        let index = author.published_recipes.findIndex((recipe) => {
            return recipe._id.toString() === req.params.recipe_id.toString(); 
        });
        author.published_recipes.splice(index, 1);
        await author.save();
        res.status(200).send(result);
    }
}));

router.post('/', asyncWrapper(async (req, res) => {
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send({message: "No user was found with given email."});

    let author = await Author.findOne({email: req.body.email});
    if(author) return res.status(409).send({message: "Author with given email already exists."});

    let newAuthor = new Author({
        user: user._id,
        email: req.body.email,
        published_recipes: []
    });

    let result = await newAuthor.save();
    res.status(201).send(result);
}));

// The only reason for author docs to update on their own is to add a new recipe or edit one of 
// the previous ones.
router.patch('/:id', [validateObjectId], asyncWrapper(async (req, res) => {
    
    let author = await Author.findById(req.params.id);
    if(!author) return res.status(404).send({message: 'No author was not found with given id.'});

    //TODO: Add validation for incoming recipe object.
    let newRecipe = new Recipe(req.body.recipe) // This should be a reipe object as defined in recipe schema.
    let recipeRes = await newRecipe.save();

    author.published_recipes.push(recipeRes);
    let authorResult = await author.save();
    res.status(200).send(authorResult);
}));

router.delete('/', asyncWrapper(async (req, res) => {
    let result = await Author.deleteMany({});

    if(result.deletedCount === 0) return res.status(200).send({message: 'There is no document to delete.'});
    res.status(200).send({message: `${result.deletedCount} documents deleted successfully.`});
}));

router.delete('/:id', [validateObjectId], asyncWrapper(async (req, res) => {
    let result = await Author.findByIdAndRemove(req.params.id);

    if(!result) return res.status(404).send({message: 'user with given id was not found.'});
    res.status(200).send(result)
}));


// Exporting the router object.
module.exports = router;