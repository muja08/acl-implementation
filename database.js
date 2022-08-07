const mysql = require("promise-mysql")
exports.calories_db = mysql.createPool({
	connectionLimit: 100,
	connectTimeout : 60 * 60 * 1000,
    aquireTimeout : 60 * 60 * 1000,
    timeout : 60 * 60 * 1000,
	host: process.env.mysqlHost,
	port: 3306,
	user: process.env.mysqlUser,
	password: process.env.mysqlPassword,
	database: process.env.mysqlDatabase,
	supportBigNumbers: true
})