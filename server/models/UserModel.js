const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'config/.env'})

let userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 250,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // Regular expression pattern for validating email addresses.
        // Pattern source: https://emailregex.com/index.html
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    profile_picture: {
        src: {
            type: String,
            default: './images/blank-profile-picture.png' // TODO: Test this path later in milestone 2: front-end
        },
    },
    favorite_recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
        }
    ]
});

userSchema.methods.signJWT =  async function() {
    let token = jwt.sign({_id: this._id, email: this.email}, process.env.JWT_SECRET, {expiresIn: '8h'});
    return token;
}

function validateUser(user) { // This function is for validation of incoming body request. (Based on joi module). 
    const schema = Joi.object({
        username: Joi.string().required().min(3).max(50),
        email: Joi.string().required().min(5).max(50).email(),
        password: Joi.string().required().min(5),
        profile_picture: Joi.string()
    })

    return schema.validate(user);
}

let User = mongoose.model('User', userSchema);

module.exports.validateUser = validateUser;
module.exports.User = User;