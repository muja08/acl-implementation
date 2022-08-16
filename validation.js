const { body } = require('express-validator');

exports.login = [
    body('user_name', 'user_name is required').not().isEmpty().isAlphanumeric(),
    body('password', 'password is required field, can be alphanumeric of length 8 to 15').notEmpty().isAlphanumeric().isLength({ min: 8, max:15 })
]

exports.signup = [
    body('user_name', 'user_name is required field').notEmpty().isAlphanumeric(),
    body('password', 'password is required field, can be alphanumeric of length 8 to 15').notEmpty().isAlphanumeric().isLength({ min: 8, max:15 }),
    body('user_role', 'user_role is required field').notEmpty().isIn(['admin', 'seller', 'supporter', 'customer']),
    body('first_name', 'Invalid first_name').optional().isString(),
    body('last_name', 'Invalid last_name').optional().isString(),
]

exports.productCreate = [
]
exports.productUpdate = [
]
exports.productUpdateStatus = [
]
exports.productList = [
]
exports.productDelete = [
]