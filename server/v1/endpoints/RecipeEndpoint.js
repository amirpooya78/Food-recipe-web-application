const express = require('express');
const { Recipe, validateRecipe } = require('../../models/RecipeModel.js');
const { validateObjectId } = require('../../middlewares/ObjectIdMiddleware.js');
const { Ingredient } = require('../../models/IngredientModel.js');
const asyncWrapper = require('../../middlewares/trycatchWrapper.js');

const router = express.Router();
router.use(express.json());

//needs a wrapper
router.get ('/', asyncWrapper(async (req, res) => {
    try{
        let recipes = await Recipe.find().populate('list_of_ingredients.ingredient', 'name');
        res.status(200).send(recipes); 
    }
    catch{
        res.status(500).res.send(err);
    }
}));

router.get ('/:id', [validateObjectId], asyncWrapper(async (req, res) => {
    
    let recipe = await Recipe.findById(req.params.id).populate('list_of_ingredients.ingredient', 'name unit_of_measurement')
   
    if (!recipe) res.status(404).res.send({message : 'the recipe with the given id was not found. '});
    
    res.status(200).send(recipe);

}));

router.post('/', asyncWrapper(async (req, res)=> {
    let { error } = validateRecipe(req.body);
    if(error) return res.status(400).send({message: `Bad request ${error.details[0].message}.`});


    let ingredients = await req.body.list_of_ingredients.map(async (ing) => {
        let ingredientName = ing.ingredient.toString();
        
        let ingredient = await Ingredient.findOne({name: ingredientName});

        if(ingredient){
            return {ingredient: ingredient._id, quantity: parseFloat(ing.quantity)}
        }else{
            return res.status(400).send({message: `Bad requiest - Invalid ingredient: ${ingredientName}`});
        }
    });

    // We are forced to use Promise.all so we can make sure all the promises are resolved.
    ingredients = await Promise.all(ingredients);

    let newRecipe = new Recipe(req.body);
    newRecipe.list_of_ingredients = ingredients;
    
    let result = await newRecipe.save();

    res.status(201).send(result);
}));


router.put('/:id', [validateObjectId], asyncWrapper(async (req, res)=> {

    let ingredients = await req.body.list_of_ingredients.map(async (ing) => {
        let ingredientName = ing.ingredient.toString();
        
        let ingredient = await Ingredient.findOne({name: ingredientName});

        if(ingredient){
            return {ingredient: ingredient._id, quantity: parseFloat(ing.quantity)}
        }else{
            return res.status(400).send({message: `Bad requiest - Invalid ingredient: ${ingredientName}`});
        }
    });

    // We are forced to use Promise.all so we can make sure all the promises are resolved.
    ingredients = await Promise.all(ingredients);

    req.body.list_of_ingredients = ingredients;

    let result = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!result) res.satus(404).res.send({message : 'the recipe with the given id was not found'});

    res.status(200).send(result);

}));

router.patch('/:id', [validateObjectId], asyncWrapper(async (req, res)=> {

    let recipe = await Recipe.findById(req.params.id)
    
    if(!recipe) res.status(404).res.send({message : 'the recipe with the given id was not found'})
    Object.assign(recipe, req.body);

    recipe = await recipe.save();
    res.status(200).send(recipe);

}));


router.delete('/:id', [validateObjectId], asyncWrapper(async (req,res)=>{

    let result = await Recipe.findByIdAndRemove(req.params.id)

    if(!result) res.status(404).send({message: 'the recipe with the given id was not found'})

    res.status(200).send(result);

}));


module.exports = router;
