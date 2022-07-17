const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const logger = require('./logger').logger

const dbName = 'koinx';

async function getConnection() {
    if (this.db) {
        return this.db
    }
    await client.connect();
    logger.info('Mongo connection successfull');
    this.db = client.db(dbName);
    return this.db
}
module.exports = getConnection