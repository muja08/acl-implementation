const db = require('../database.js').calories_db
const { validationResult } = require('express-validator');
const logger = require('./../logger').logger

exports.create = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let payload = req.body

        let foodCreate = await dbConn.query("insert ignore into foods (food_name, uom, unit, calories) values (?, ?, ?, ?)", [payload.food_name, payload.unit_of_measurement, payload.unit, payload.calories])

        if (foodCreate.affectedRows) {
            res.json({
                status: 200,
                success: true,
                message: 'food entry creation successfull',
                result: {
                    foodId: foodCreate.insertId
                }
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: `food entry '${payload.food_name}' already exists!`,
            })
        }
    } catch (error) {
        logger.error("Error in creating food", error)
        res.json({
            status: 500,
            error,
            message: "Not able to create a food!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};

exports.update = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        let foodId = req.params.id
        let payload = req.body

        let food = await dbConn.query("select * from foods where id=?", [foodId])

        if (!(food && food.length)) {
            res.json({
                status: 200,
                success: true,
                message: `food entry '${foodId}' not exists!`,
            })
            return
        }

        let foodUpdate = await dbConn.query("update foods set food_name=?, uom=?, unit=?, calories=? where id=?", [payload.food_name, payload.unit_of_measurement, payload.unit, payload.calories, foodId])

        if (foodUpdate.affectedRows) {
            res.json({
                status: 200,
                success: true,
                message: 'food entry updation successfull',
                result: {
                    foodId
                }
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: `food entry '${foodId}' not exists!`,
            })
        }
    } catch (error) {
        logger.error("Error in updating food", error)
        res.json({
            status: 500,
            error,
            message: "Not able to update a food!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};

exports.delete = async function (req, res) {
    const dbConn = await db.getConnection()
    try {

        const payload = req.params

        let foodInUserIntake = await dbConn.query("select * from user_food_intake where food_id=?", [payload.id])

        if (foodInUserIntake && foodInUserIntake.length) {
            res.json({
                status: 200,
                success: true,
                message: `Couldn't delete food entry, consumed by user!`,
            })
            return
        }

        let foodDelete = await dbConn.query("delete from foods where id=?", [payload.id])

        if (foodDelete.affectedRows) {
            res.json({
                status: 200,
                success: true,
                message: 'food entry deletion successfull',
                result: {
                    foodId: payload.id
                }
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: `food entry '${payload.id}' not exists!`,
            })
        }

    } catch (error) {
        logger.error("Error in deleting food", error)
        res.json({
            status: 500,
            error,
            message: "Not able to delete a food!!"
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



        let baseQuery = "select * from foods where 1=1 "
        let queryParams = []
        if (payload.food_id) {
            queryParams.push(payload.food_id)
            baseQuery += "&& id=? "
        }

        if (payload.food_name) {
            queryParams.push(payload.food_name)
            baseQuery += "&& food_name=? "
        }

        let foods = await dbConn.query(baseQuery, queryParams)

        res.json({
            status: 200,
            success: true,
            result: {
                foods
            }
        })


    } catch (error) {
        logger.error("Error in getting foods", error)
        res.json({
            status: 500,
            error,
            message: "Not able to list foods!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};