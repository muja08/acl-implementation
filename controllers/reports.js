const db = require('../database.js').calories_db
const logger = require('./../logger').logger
const moment = require('moment-timezone')

exports.adminReport = async function (req, res) {
    const dbConn = await db.getConnection()
    try {

        let today = new Date()
        let formattedCurrWeekLastDay = moment(today).format('YYYY-MM-DD')
        let formattedCurrWeekFirstDay = moment(today).subtract(6, 'DAY').format('YYYY-MM-DD')
        let formattedPrevWeekLastDay = moment(today).subtract(7, 'DAY').format('YYYY-MM-DD')
        let formattedPrevWeekFirstDay = moment(today).subtract(13, 'DAY').format('YYYY-MM-DD')

        let baseQuery = `SELECT u.id AS user_id,
                u.fullname,
                u.user_name,
                currWeek.numintakein7days               AS 'No. of Intakes in 7 days',
                currWeek.avgcaloriesintakein7days       AS 'Average Calories taken in 7 days',
                currWeek.totalcaloriesintakein7days     AS 'Total Calories taken in 7 days',
                prevWeek.numintakeinprev7days           AS 'No. of Intakes in previous week',
                prevWeek.avgcaloriesintakeinprev7days   AS 'Average Calories taken in previous week',
                prevWeek.totalcaloriesintakeinprev7days AS 'Total Calories taken in previous week',
                currDay.numintakecurrday                AS 'No. of Intakes in Current Day',
                currDay.avgcaloriesintakecurrday        AS 'Average Calories taken in Current Day',
                currDay.totalcaloriescurrday            AS 'Total Calories taken in Current Day'
        FROM   (
                        SELECT     ufi.user_id,
                                    Round(Sum(ufi.unit * (f.calories / f.unit)), 2) AS totalCaloriesIntakeIn7Days,
                                    Count(ufi.id)                                   AS NumIntakeIn7Days,
                                    Round(Avg(ufi.unit * (f.calories / f.unit)), 2) AS AvgCaloriesIntakeIn7Days
                        FROM       user_food_intake ufi
                        INNER JOIN foods f
                        ON         f.id=ufi.food_id && Date(ufi.intake_at) >= ? && Date(ufi.intake_at) <= ?
                        GROUP BY   ufi.user_id) currWeek,
                (
                        SELECT     ufi.user_id,
                                    Round(Sum(ufi.unit * (f.calories / f.unit)), 2) AS totalCaloriesIntakeInPrev7Days,
                                    Count(ufi.id)                                   AS NumIntakeInPrev7Days,
                                    Round(Avg(ufi.unit * (f.calories / f.unit)), 2) AS AvgCaloriesIntakeInPrev7Days
                        FROM       user_food_intake ufi
                        INNER JOIN foods f
                        ON         f.id=ufi.food_id && Date(ufi.intake_at) >= ? && Date(ufi.intake_at) <= ?
                        GROUP BY   ufi.user_id) prevWeek,
                (
                        SELECT     ufi.user_id,
                                    Round(Sum(ufi.unit * (f.calories / f.unit)), 2) AS totalCaloriesCurrDay,
                                    Count(ufi.id)                                   AS NumIntakeCurrDay,
                                    Round(Avg(ufi.unit * (f.calories / f.unit)), 2) AS AvgCaloriesIntakeCurrDay
                        FROM       user_food_intake ufi
                        INNER JOIN foods f
                        ON         f.id=ufi.food_id && Date(ufi.intake_at) >= ?
                        GROUP BY   ufi.user_id) currDay,
                (
                    SELECT id,
                                    Concat(first_name, ' ', last_name) AS fullname,
                            user_name
                    FROM   users) u
        WHERE  u.id = currDay.user_id && currDay.user_id = prevWeek.user_id && prevWeek.user_id = currWeek.user_id;`

        let queryParams = [formattedCurrWeekFirstDay, formattedCurrWeekLastDay, formattedPrevWeekFirstDay, formattedPrevWeekLastDay, formattedCurrWeekLastDay]

        let userWiseIntakeReport = await dbConn.query(baseQuery, queryParams)

        res.json({
            status: 200,
            success: true,
            result: {
                userWiseIntakeReport
            }
        })


    } catch (error) {
        logger.error("Error in reports", error)
        res.json({
            status: 500,
            error,
            message: "Not able to get admin reports!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
};