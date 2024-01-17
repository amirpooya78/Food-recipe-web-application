const authorEndpoints = require('./authorEndpoints.js');
const userEndpoints = require('./userEndpoints.js');
const ingredientEndpoints = require('./ingredientEndpoint.js');
const recipeEndpoints = require('./RecipeEndpoint.js');
const loginEndpoint = require('./login.js');

module.exports = function(app) {
    app.use('/api/v1/authors', authorEndpoints);
    app.use('/api/v1/users', userEndpoints);
    app.use('/api/v1/recipes', recipeEndpoints);
    app.use('/api/v1/ingredients', ingredientEndpoints);
    app.use('/api/v1/login', loginEndpoint);
}