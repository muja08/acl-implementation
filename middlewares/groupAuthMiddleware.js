module.exports = function (authRoles) {
    return (req, res, next) => {
        let decoded = req.decoded
        if (authRoles.length) {
            if (authRoles.find(f => f === '*')) {
                next()
            } else if (authRoles.find(f => f === decoded.role)) {
                next()
            } else {
                var error = new Error('Authorization Failed!');
                res.status(401).json({
                    success: false,
                    message: 'User does not have certain privileges to access this API!',
                });
                return next(error);
            }
        } else {
            next()
        }
    }
};

















