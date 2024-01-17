const jwt = require('jsonwebtoken');

function authentication(req, res, next) { 
    const token = req.header('x-access-token');

    if(!token) {
        return res.status(401).send({message: "token was not provided"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.params.id = decoded._id;
        req.params.userId = decoded._id; // In case if we are sending a request to other endpoints than users's
        next();
    } catch(err) {
        console.error(err);
        return res.status(403).json({message: "Forbidden - unauthorized"})
    }
}

module.exports.authentication = authentication;