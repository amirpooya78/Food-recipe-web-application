const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../../models/UserModel.js');
const asyncWrapper = require('../../middlewares/trycatchWrapper.js');

const router = express.Router();

// HTTP POST handled for loggin-in
router.post('/', asyncWrapper(async (req, res) => {
    let {email, password} = req.body;
    if(!email || !password) return res.status(400).send({message: "Bad request: Password and email are required."});

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send({message: 'Bad request - No user was fount by given email.'});

    let isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword) return res.status(401).send({message: 'Unauthorized - Invalid password'});

    let token = await user.signJWT();

    res.status(200).header('x-access-token', token).json({token});
}));

//exporting the router
module.exports = router;