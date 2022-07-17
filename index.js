var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const logger = require('./logger').logger

var cors = require('cors');

const { info, listTransactions } = require('./validation');

var transactionController = require('./controllers/transactions')
var priceController = require('./controllers/price')

const mongoConnect = require('./mongo-conn')
async function main() {

    // mongo connection
    await mongoConnect()

    // Ethereum Bot
    logger.info('Ethereum price Bot started');
    
    // Task 2
    setInterval(async () => {
        await priceController.captureEthereumPrice()
    }, 600000);
}
main()


app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(cors());

// Task 1
app.get('/api/listTransactions', listTransactions, transactionController.listTranscations)

// Task 3
app.get('/api/info', info, transactionController.getBalanceAndEthereumPrice)


var server = app.listen(8081, function () {
   var host = 'localhost'
   var port = server.address().port
   logger.info(`App listening at http://${host}:${port}`)
})