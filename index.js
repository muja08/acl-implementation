var express = require('express');
var app = express();
require('dotenv').config()
var bodyParser = require('body-parser');
const logger = require('./logger').logger

const cluster = require('cluster')
const os = require('os')
const noOfCPU = os.cpus().length

//validator
const validation = require('./validation');

// middlewares 
var authMiddleware = require('./middlewares/authMiddleware');
var authorizeMiddleware = require('./middlewares/groupAuthMiddleware');

// controllers
var publicController = require('./controllers/publicCalls')
var productController = require('./controllers/product')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/product*", authMiddleware)


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
app.post('/login', validation.login, publicController.login)
app.post('/signup', validation.signup, publicController.signup)

// product 
// pass * in authorizeMiddleware function if you want to give access to all user roles
app.post('/product', authorizeMiddleware(['admin', 'seller']), validation.productCreate, productController.create)
app.get('/product', authorizeMiddleware(['admin', 'seller', 'supporter', 'customer']), validation.productList, productController.list)
app.put('/product', authorizeMiddleware(['admin', 'seller']), validation.productUpdate, productController.update)
app.patch('/product/:id', authorizeMiddleware(['admin', 'seller']), validation.productUpdateStatus, productController.updateProductStatus)
app.delete('/product/:id', authorizeMiddleware(['admin', 'supporter']), validation.productDelete, productController.delete)