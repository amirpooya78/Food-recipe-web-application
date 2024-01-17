let mongoose = require('mongoose');
const Joi = require('joi');

let ingredientSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    unit_of_measurement: {
        type: String,
        required: true,
        
    },
});

function validateIngredient (body){
    const Schema = Joi.object({
        name : Joi.string().required(),
        unit_of_measurement : Joi.string().required()
    })

    return Schema.validate(body);
}
let Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports.Ingredient = Ingredient;
module.exports.validateIngredient = validateIngredient