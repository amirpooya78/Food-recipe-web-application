const express = require('express');
const { Ingredient, validateIngredient } = require('../../models/IngredientModel.js');
const { validateObjectId } = require('../../middlewares/ObjectIdMiddleware.js');
const asyncWrapper = require('../../middlewares/trycatchWrapper.js');

const router = express.Router();
router.use(express.json());

router.get('/', asyncWrapper(async (req, res) => {
        let ingredients = await Ingredient.find().sort('name');
        return res.status(200).send(ingredients);
}));

router.get('/:id', [validateObjectId], asyncWrapper(async (req, res) => {

    let ingredients = await Ingredient.findById(req.params.id);
    
    if(!ingredients) return res.status(404).send({message: 'ingredient with given id was not found.'});
    
    res.status(200).send(ingredients);
}));

router.post('/', asyncWrapper(async (req, res) => {
    let { error } = validateIngredient(req.body);
    if(error) return res.status(400).send({message: 'Invalid body request for posting an ingredient.'});

    let ingredient = await Ingredient.findOne({name: req.body.name});
    if(ingredient) return res.status(409).json({ message: "Ingredient with the same name already exists." });

    ingredient = new Ingredient({
        name: req.body.name,
        unit_of_measurement: req.body.unit_of_measurement
    });

    let result = await ingredient.save();
    return res.status(201).send(result);
}));

router.put('/:id', [validateObjectId], asyncWrapper(async (req, res) => {
    let { error }  = validateIngredient(req.body); 
    if(error) return res.status(400).send({message: `Bad request: ${error.details[0].message}`});
    

    let ingredients = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!ingredients) return res.status(404).send({message: 'ingredient with given id was not found.'});
    res.status(200).send(ingredients);
}));


router.patch('/:id', [validateObjectId], asyncWrapper(async (req, res) => {
    // mising validation
    let ingredient = await Ingredient.findById(req.params.id);

    if(!ingredient) return res.status(404).send({message: 'ingredient with given id was not found.'});
    Object.assign(ingredient, req.body);

    ingredient = await ingredient.save();
    res.status(200).send(ingredient);
}));

router.delete('/:id', [validateObjectId], asyncWrapper(async (req, res) => {    
    
        let result = await Ingredient.findByIdAndRemove(req.params.id);

        if (!result) return res.status(404).send({ message: 'Ingredient with given id was not found.' });
        
        res.status(200).send(result);
    
}));


module.exports = router;