const { check } = require('express-validator');

exports.login = [
    check('user_name', 'user_name is required').not().isEmpty().isString(),
    check('password', 'password is required').not().isEmpty().isString(),
]

exports.foodCreate = [
    check('food_name', 'food_name is required').not().isEmpty().isString(),
    check('unit_of_measurement', 'unit_of_measurement is required').not().isEmpty().isIn(['gram', 'litre']),
    check('unit', 'unit is required').not().isEmpty().isFloat(),
    check('calories', 'calories is required').not().isEmpty().isFloat(),
]

exports.foodUpdate = [
    check('food_name', 'food_name is required').not().isEmpty().isString(),
    check('unit_of_measurement', 'unit_of_measurement is required').not().isEmpty().isIn(['gram', 'litre']),
    check('unit', 'unit is required').not().isEmpty().isFloat(),
    check('calories', 'calories is required').not().isEmpty().isFloat(),
]

exports.foodList = [
    check('food_id', 'Invalid food_id').optional().isInt(),
    check('food_name', 'Invalid food_name').optional().isString(),
]

exports.userFoodIntakeCreate = [
    check('food_id', 'food_id is required').not().isEmpty().isInt(),
    check('unit', 'unit is required').not().isEmpty().isFloat(),
    check('intake_at', 'intake_at is required').not().isEmpty().isString(),
]

exports.userIntakeThreshold = [
    check('threshold', 'threshold is required').not().isEmpty().isFloat(),
]

exports.userFoodsList = [
    check('user_id', 'Invalid user_id').optional().isInt(),
    check('food_name', 'Invalid food_name is required').optional().isString(),
    check('from', 'Invalid from').optional().isString(),
    check('to', 'Invalid to').optional().isString(),
]