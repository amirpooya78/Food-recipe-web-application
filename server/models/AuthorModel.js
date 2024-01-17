const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
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
    published_recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ]
});

const Author = mongoose.model('Author', authorSchema);

module.exports.Author = Author;