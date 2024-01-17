let express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');
let path = require('path');
let cors = require('cors');
let history = require('connect-history-api-fallback');
// Routers 
let v1Routers = require('./v1/endpoints/v1routes.js');
let methodOverride = require('method-override');
// Variables
let mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/animalDevelopmentDB';
let port = process.env.PORT || 3000;

// Loads the environment variables
require('dotenv').config({path: 'config/.env'})
// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
let app = express();

//HTTP method override
// override with different headers; last one takes precedence
app.use(methodOverride('X-HTTP-Method')) //          Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) //      IBM
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());
// *Use endpoints version 1.
v1Routers(app);

// Import routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
let root = path.normalize(__dirname + '/..');
let client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
let env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    let err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
