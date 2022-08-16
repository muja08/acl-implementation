var jwt = require('jsonwebtoken');
const db = require('../database.js').one_db
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

            console.log('userData', userData)
            console.log('payload', payload)

            if (userData[0].Password === payload.password) {


                let tokenPay = {
                    user_id: userData[0].user_id,
                    first_name: userData[0].first_name,
                    last_name: userData[0].last_name,
                    user_name: userData[0].user_name,
                    role: userData[0].role,
                    dateTime: new Date()
                };


                let token = jwt.sign(tokenPay, process.env.jwtSecretKey, { expiresIn: process.env.jwtTokenExpiry });

                res.status(200).json({
                    success: true,
                    token
                })

            } else {
                res.status(401).json({
                    success: true,
                    message: 'Authentication failed!',
                });
            }

        } else {
            res.status(200).json({
                success: true,
                message: 'Invalid user_name!',
            });
        }
    } catch (error) {
        logger.error("Error in login call", error)
        res.status(500).json({
            error,
            message: "Not able to login!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};


exports.signup = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let payload = req.body

        let userData = await dbConn.query("insert into users (user_name, first_name, last_name, Password) values (?,?,?,?)", [payload.user_name, payload.first_name, payload.last_name, payload.password])

        console.log('userData', userData)


        let userRole = await dbConn.query("insert into user_role (user_id, role) values (?,?)", [userData.insertId, payload.user_role])

        res.status(200).json({
            userId: userData.insertId,
            message: "User creation successfull"
        })

    } catch (error) {
        logger.error("Error in Signup call", error)
        res.status(500).json({
            error,
            message: "Not able to Signup!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};