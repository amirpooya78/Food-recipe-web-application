'use strict'

const express = require('express');
const mongoose = require('mongoose');
const { User, validateUser } = require('../../models/UserModel.js');
const { validateObjectId } = require('../../middlewares/ObjectIdMiddleware.js');
const { authentication } = require('../../middlewares/authentication.js');
const bcrypt = require('bcrypt');
const asyncWrapper = require('../../middlewares/trycatchWrapper.js');
const { Recipe } = require('../../models/RecipeModel.js');
const router = express.Router();
router.use(express.json());

//HTTP Handlers
router.get('/', asyncWrapper(async (req, res) => {
    try{
        let users = await User.find().select('-password');
        return res.status(200).send(users);
    } catch(err) {
        res.status(500).send(err)
    }
    
}));

router.get('/:id/favorite_recipes', [authentication, validateObjectId], asyncWrapper(async (req,res) => {

    let user = await User.findById(req.params.id).populate({path: 'favorite_recipes'});

    if (!user) return res.status(404).send({message: 'User with given id was not found'});
    
  //if (!user.favorite_recipes) return res.status (200).send({message : 'user with given id has no favorite recipes'});
    
    res.status(200).send(user.favorite_recipes);

}));

router.post('/:id/favorite_recipes', [authentication, validateObjectId], asyncWrapper(async (req, res) => {
    let user = await User.findById(req.params.id).populate({path : 'favorite_recipes'});
    if(!user) return res.status(404).json({message: 'User with given id was not found.'});

    let newFavorite = await Recipe.findById(req.body.recipe);
    if(!newFavorite) return res.status(404).json({message: 'Recipe with given id was not found.'});

    user.favorite_recipes.forEach((recipe) => {
        if(recipe._id.toHexString() ===  newFavorite._id.toHexString()) {
            return res.status(409).json({message: 'Recipe is already in the favorite list'});
        }
    });

    user.favorite_recipes.push(newFavorite._id);
    let result = await user.save();

    res.status(201).json(result);
}));

router.delete('/:id/favorite_recipes', [authentication, validateObjectId], asyncWrapper(async (req, res) => {

    let user = await User.findById(req.params.id).populate({path: 'favorite_recipes'});
    if(!user) return res.status(404).send({message: 'User with given id was not found'});

    user.favorite_recipes = [];
    
    let result = await user.save();

    res.status(200).json(result);
}));

router.delete('/:id/favorite_recipes/:recipe_id', [authentication ,validateObjectId], asyncWrapper(async (req, res) => {
    let user = await User.findById(req.params.id).populate({path: 'favorite_recipes'});
    if(!user) return res.status(404).send({message: 'User with given id was not found'});

    let index = -1

    index = user.favorite_recipes.findIndex((recipe) => {
        return recipe._id.toHexString() === req.params.recipe_id
    })

    if(index != -1) {
        user.favorite_recipes.splice(index, 1);
        let result = await user.save();
        return res.status(200).json(result);
    }
    else{
        return res.status(404).send({message: 'Recipe with given id is not in favorite list'});
    }
}));

router.get('/:id', [authentication, validateObjectId], asyncWrapper(async (req, res) => {

    let user = await User.findById(req.params.id);
    
    if(!user) return res.status(404).send({message: 'User with given id was not found.'});

    const userWithLinks = {
        _id: user.id,
        username: user.username,
        email: user.email,
        favorite_recipes: {
            href: `/users/${user._id}/favorite_recipes`,
            rel: 'favorite_recipes',
            type: 'GET'
        }
    }
    
    res.status(200).send(userWithLinks);
}));

router.post('/',  asyncWrapper(async (req, res) => {
    
    let { error } = validateUser(req.body);
    if (error) return res.status(400).send({message: `Bad request: ${error.details[0].message}`})

    let user = await User.findOne({email: req.body.email});

    if(user) {
        console.log(user);
        return res.status(200).send({message: 'User with given email is already resigstered.'}); 
    }

    let hashed = await bcrypt.hash(req.body.password, 10);

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        profile_picture: req.body.profile_picture
    })

    let token = await user.signJWT();
    let savedUser = await user.save();

    Object.assign(savedUser._doc, {'token': token}); 
    // For some reasons can't add object directly to the mongoose results we have to add extra properties to 
    // the _doc property 

    res.status(201).json(savedUser);
}));

router.put('/:id', [authentication, validateObjectId], asyncWrapper(async (req, res) => {
    
    if(req.body.password) {
        const hashed = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashed;
    }

    let user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!user) return res.status(404).send({message: 'User with given id was not found.'});
    res.status(200).send(user);
}));

router.patch('/:id', [authentication, validateObjectId], asyncWrapper(async (req, res) => {
    let user = await User.findById(req.params.id);

    if(!user) return res.status(404).send({message: 'user with given id was not found.'});
    Object.assign(user, req.body);

    if(req.body.password) {
        let hashed = await bcrypt.hash(req.body.password, 10);
        user.password = hashed;
    }

    user = await user.save();
    res.status(200).send(user);
}));

router.delete('/:id', [validateObjectId], asyncWrapper(async (req, res) => {    
    let result = await User.findByIdAndRemove(req.params.id);

    if(!result) return res.status(404).send({message: 'User with given id was not fonud.'});
    res.status(200).send(result);
}));

// Exporting the router.
module.exports = router;