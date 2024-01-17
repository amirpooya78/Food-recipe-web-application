let mongoose = require ('mongoose');
let Joi = require('joi');

let pictureSchema = new mongoose.Schema({ // it's been done to set the default path of pictures for all the pictures
    path: {
        type: String,
        default: 'images/dish.png', // Default path for pictures
    },
})

let recipeSchema = new mongoose.Schema({
_id : {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
}, 
name : {
    type : String,
    required : true,
},
information : {
    type : String,
    required : true,
},
nutrition_information : {
    type : String,
    required : true,
},
pictures : [pictureSchema], // there is an array of pictures 
list_of_ingredients : [
    {
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient",
            required: true
        },
        quantity: {type: Number, required: true}
    }
] 

});

const Recipe = mongoose.model('Recipe', recipeSchema);

function validateRecipe(body) {
    let schema = Joi.object({
        name: Joi.string().required(),
        information: Joi.string().required(),
        nutrition_information: Joi.string().required(),
        list_of_ingredients: Joi.array().required()
    })

    return schema.validate(body);
}

module.exports.Recipe = Recipe;
module.exports.validateRecipe = validateRecipe;

