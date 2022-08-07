const db = require('../database.js').calories_db
const { validationResult } = require('express-validator');
const logger = require('./../logger').logger
const moment = require('moment-timezone')


exports.create = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let payload = req.body
        let foodId = req.body.food_id
        let decoded = req.decoded

        console.log(decoded, 'decoded')


        let food = await dbConn.query("select * from foods where id=? limit 1", [foodId])

        if (!(food && food.length)) {
            res.json({
                status: 200,
                success: true,
                message: `food entry '${foodId}' not exists!`,
            })
            return
        }

        let foodIntake = await dbConn.query("insert into user_food_intake (user_id, food_id, unit, intake_at) values (?, ?, ?, ?)", [decoded.user_id, payload.food_id, payload.unit, payload.intake_at])

        if (foodIntake.affectedRows) {
            res.json({
                status: 200,
                success: true,
                message: 'food intake entry creation successfull',
                result: {
                    intakeId: foodIntake.insertId
                }
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: `Not able to create entry for food intake!`,
            })
        }
    } catch (error) {
        logger.error("Error in creating food intake entry", error)
        res.json({
            status: 500,
            error,
            message: "Not able to create a food intake entry!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};


exports.list = async function (req, res) {
    const dbConn = await db.getConnection()
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        const payload = req.query
        const decoded = req.decoded

        let baseQuery = "select ufi.user_id, concat(u.first_name, ' ', u.last_name) as fullname, ufi.food_id, f.food_name, (ufi.unit * (f.calories / f.unit)) AS calorieIntake, ufi.intake_at from user_food_intake ufi inner join foods f on f.id=ufi.food_id inner join users u on u.id = ufi.user_id where 1=1"
        let queryParams = []

        console.log('decoded', decoded)
        
        if (decoded.role === 'admin') {
            if (payload.user_id) {
                queryParams.push(payload.user_id)
                baseQuery += "&& ufi.user_id=? "
            }
        } else if (decoded.role === 'subscriber') {
            queryParams.push(decoded.user_id)
            baseQuery += "&& ufi.user_id=? "
        }



        if (payload.food_name) {
            queryParams.push(payload.food_name)
            baseQuery += "&& f.food_name=? "
        }

        if (payload.from) {
            queryParams.push(payload.from)
            baseQuery += "&& ufi.intake_at>=? "
        }

        if (payload.to) {
            queryParams.push(payload.to)
            baseQuery += "&& ufi.intake_at<=? "
        }


        let userFoodsIntakes = await dbConn.query(baseQuery, queryParams)

        res.json({
            status: 200,
            success: true,
            result: {
                userFoodsIntakes
            }
        })
        
        
    } catch (error) {
        logger.error("Error in getting user foods", error)
        res.json({
            status: 500,
            error,
            message: "Not able to list user foods!!"
        })
    } finally {
		db.releaseConnection(dbConn)
	}
};


exports.updateThreshold = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let payload = req.body
        let decoded = req.decoded

        await dbConn.query("update user_calories_threshold set threshold=? where user_id=?", [payload.threshold, decoded.user_id])

        res.json({
            status: 200,
            success: true,
            message: 'user threshold updation successfull',
        })
    } catch (error) {
        logger.error("Error in updating user threshold", error)
        res.json({
            status: 500,
            error,
            message: "Not able to update user threshold!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};


exports.userDaywiseReport = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let decoded = req.decoded

        let baseQuery = `SELECT daywise.user_id, daywise.daywiseIntake as calories, 
        daywise.intake_at as consumedAt,
                CASE
                    WHEN daywise.daywiseintake >= uct.threshold THEN 'Reached'
                    ELSE 'Not Reached'
                END AS calorieThresholdStatus
        FROM   (
                        SELECT   userCalorieIntake.user_id,
                                Sum(userCalorieIntake.calorieintake) AS daywiseIntake,
                                DATE(userCalorieIntake.intake_at) AS intake_at
                        FROM     (
                                            SELECT     ufi.user_id,
                                                        ufi.food_id,
                                                        ufi.unit,
                                                        Date(ufi.intake_at)                AS intake_at,
                                                        (ufi.unit * (f.calories / f.unit)) AS calorieIntake
                                            FROM       user_food_intake ufi
                                            INNER JOIN foods f
                                            ON         f.id=ufi.food_id && ufi.user_id = ?) userCalorieIntake
                        GROUP BY userCalorieIntake.intake_at) daywise,
                (
                    SELECT threshold
                    FROM   user_calories_threshold
                    WHERE  user_id=?) uct;`
        
        let queryParams = [decoded.user_id, decoded.user_id]

        let daywiseIntakeStatus = await dbConn.query(baseQuery, queryParams)

        daywiseIntakeStatus.forEach((each) => {
            each.consumedAt = moment(each.consumedAt).format('D MMMM YYYY')
        })

        res.json({
            status: 200,
            success: true,
            result: {
                daywiseIntakeStatus
            }
        })
    } catch (error) {
        logger.error("Error in getting daywise report", error)
        res.json({
            status: 500,
            error,
            message: "Not able to get daywise report!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};