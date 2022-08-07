var express = require('express');
var app = express();
require('dotenv').config()
var bodyParser = require('body-parser');
const logger = require('./logger').logger

const cluster = require('cluster')
const os = require('os')
const noOfCPU = os.cpus().length

//validator
const { login, foodCreate, foodUpdate, foodList, userFoodIntakeCreate, userIntakeThreshold, userFoodsList } = require('./validation');

// middlewares 
var authMiddleware = require('./middlewares/authMiddleware');
var authorizeMiddleware = require('./middlewares/groupAuthMiddleware');

// controllers
var publicController = require('./controllers/publicCalls')
var foodController = require('./controllers/food-crud')
var userFoodController = require('./controllers/user-food')
var reportsController = require('./controllers/reports')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api/*", authMiddleware)


// for clustering
if (cluster.isMaster) {
    for (let i=0; i<noOfCPU; i++) {
        cluster.fork()
    }
    cluster.on('exit', function(worker) {
        console.log(`worker with the process id ${worker.process.pid} died`)
        cluster.fork()
    })
} else {
    var server = app.listen(8081, function () {
        var host = 'localhost'
        var port = server.address().port
        logger.info(`App listening at http://${host}:${port}`)
     })
}

// login call
app.post('/auth/login', login, publicController.login)

// food-crud
app.post('/api/food', authorizeMiddleware(['admin', 'subscriber']), foodCreate, foodController.create)
app.put('/api/food/:id', authorizeMiddleware(['admin']), foodUpdate, foodController.update)
app.delete('/api/food/:id', authorizeMiddleware(['admin']), foodController.delete)
app.get('/api/food', authorizeMiddleware(['admin', 'subscriber']), foodList, foodController.list)

// food-intake
app.post('/api/user/foodIntake', authorizeMiddleware(['subscriber']), userFoodIntakeCreate, userFoodController.create)

// change-threshold
app.put('/api/user/threshold', authorizeMiddleware(['subscriber']), userIntakeThreshold, userFoodController.updateThreshold)

// get user daywise
app.get('/api/report/userDaywise', authorizeMiddleware(['subscriber']), userFoodController.userDaywiseReport)

// get user food list
app.get('/api/user/food', authorizeMiddleware(['admin', 'subscriber']), userFoodsList, userFoodController.list)

// admin report
app.get('/api/admin/report', authorizeMiddleware(['admin']), reportsController.adminReport)
