var axios = require('axios');
const mongoConnect = require('../mongo-conn')
const logger = require('./../logger').logger

exports.captureEthereumPrice = async function () {
    try {

        let axiosParams = {
            method: 'get',
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr',
            headers: {}
        };

        let ethereumPrice = await axios(axiosParams)

        const mongoConnection = await mongoConnect()

        await mongoConnection.collection('cryptoPrice').updateOne(
            { name: 'ethereum' },
            { $set: { name: 'ethereum', price : ethereumPrice.data.ethereum }},
            { upsert: true })
            
        logger.info("Ethereum price updated in DB")

    } catch (error) {
        logger.error("Couldn't update ethereum price in DB", error)
    }
};