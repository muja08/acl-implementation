var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

const { info, listTransactions } = require('./validation');

var transactionController = require('./controllers/transactions')
var priceController = require('./controllers/price')

const mongoConnect = require('./mongo-conn')
async function main() {

    // mongo connection
    await mongoConnect()

    // Ethereum Bot
    console.log('INFO: Ethereum price Bot started');
    setInterval(async () => {
        // Task 2
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
   console.log("INFO: App listening at http://%s:%s", host, port)
})