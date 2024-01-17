const mongoose = require('mongoose');

function validateObjectId (req, res, next) {
    let id = req.params.id;

    if(mongoose.isValidObjectId(id)){
        next();
    } else {
        res.status(400).send({message: 'Invaild given id.'});
    }
}

module.exports.validateObjectId = validateObjectId;