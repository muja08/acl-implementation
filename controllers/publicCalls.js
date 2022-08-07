var jwt = require('jsonwebtoken');
const db = require('../database.js').calories_db
const { validationResult } = require('express-validator');
const logger = require('./../logger').logger

exports.login = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let payload = req.body

        let userData = await dbConn.query("SELECT * from users u inner join user_role ur on u.id = ur.user_id && u.user_name=?", [payload.user_name])

        if (userData && userData.length) {

            if (userData[0].password === payload.password) {


                let tokenPay = {
                    user_id: userData[0].user_id,
                    first_name: userData[0].first_name,
                    last_name: userData[0].last_name,
                    user_name: userData[0].user_name,
                    email: userData[0].email,
                    role: userData[0].role,
                    dateTime: new Date()
                };


                let token = jwt.sign(tokenPay, process.env.jwtSecretKey, { expiresIn: process.env.jwtTokenExpiry });

                res.json({
                    status: 200,
                    success: true,
                    token
                })

            } else {
                res.json({
                    success: true,
                    status: 200,
                    message: 'Invalid password!',
                });
            }

        } else {
            res.json({
                success: true,
                status: 200,
                message: 'Invalid user_name!',
            });
        }
    } catch (error) {
        logger.error("Error in login call", error)
        res.json({
            status: 500,
            error,
            message: "Not able to login!!"
        })
    }
};