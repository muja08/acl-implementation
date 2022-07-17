const { check } = require('express-validator');

exports.listTransactions = [
    check('module', 'module is required').not().isEmpty(),
    check('action', 'action is required').not().isEmpty(),
    check('address', 'address is required').not().isEmpty(),
    check('apikey', 'apikey is required').not().isEmpty(),
]


exports.info = [
    check('address', 'address is required').not().isEmpty()
]