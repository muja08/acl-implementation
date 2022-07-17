var axios = require('axios');
var qs = require('qs');
const mongoConnect = require('../mongo-conn')
const { validationResult } = require('express-validator');

// list transactions and update in mongo
exports.listTranscations = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        const mongoConnection = await mongoConnect()
        let queryParams = qs.stringify(req.query)

        let payload = {
            method: 'get',
            url: 'https://api.etherscan.io/api?' + queryParams,
            headers: {}
        };

        let transactionsResponse = await axios(payload)

        let transactionsToDB = []

        transactionsResponse.data.result.forEach(object => {
            object.address = req.query.address;
            transactionsToDB.push(object)
        });

        await mongoConnection.collection('transactions').insertMany(transactionsToDB, 
            { ordered: false }
        )

        res.json({
            success: true, 
            status: 200,
            result: {
                transactions: transactionsResponse.data.result
            }
        });

    } catch (error) {
        console.log("Error: Couldn't get the transactions list", error)
        res.send({
            status: 500,
            error,
            message: "Couldn't get the transactions list"
        })
    }
};

// get balance of user and price of ethereum
exports.getBalanceAndEthereumPrice = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors)
            return
        }

        const mongoConnection = await mongoConnect()

        let etheriumPrice = await mongoConnection.collection('cryptoPrice').findOne({
            name: 'ethereum'
        })

        let transactions = await mongoConnection.collection('transactions').find({
            '$or': [
                { 'from': req.query.address }, 
                { 'to': req.query.address }
            ]
        }).toArray()

        let balance = 0
        transactions.forEach((each) => {
            if (each.from === req.query.address) {
                balance += each.value
            } else if (each.to === req.query.address) {
                balance -= each.value
            }
        })

        res.json({ 
            success: true, 
            status: 200,
            result: {
                ethereumCurrentPrice: etheriumPrice.price, 
                userCurrentBalance: balance 
            }
        });

    } catch (error) {
        console.log("Error: Couldn't get the Info", error)
        res.send({
            status: 500,
            error,
            message: "Couldn't get the Info"
        })
    }
};