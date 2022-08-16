var jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    if (!req.headers.hasOwnProperty('x-access-token')) {
        var error = new Error('Failed to authenticate token.');
        res.status(401).json({
            success: false,
            message: 'Authentication Failed!',
        });
        return next(error);
    }

    var token = req.headers['x-access-token'];
    jwt.verify(token, process.env.jwtSecretKey, (err, decoded) => {
        if (err) {
            var error = new Error('Failed to authenticate token.');
            res.status(401).json({
                success: false,
                message: 'Authentication Failed!',
            });
            return next(error);
        } else {
            req.decoded = { ...decoded }
            return next();
        }
    })
};