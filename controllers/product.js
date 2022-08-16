
const db = require('../database.js').one_db
const logger = require('./../logger').logger
exports.create = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        res.status(200).json({
            message: "Product added successfully"
        })
    } catch(error) {
        logger.error("Error in creating product", error)
        res.status(500).json({
            error,
            message: "Not able to create product!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
}

exports.list = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        res.status(200).json({
            message: "Products sent successfully"
        })
    } catch(error) {
        logger.error("Error in getting product", error)
        res.status(500).json({
            error,
            message: "Not able to get products!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
}


exports.update = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        res.status(200).json({
            message: "Product updated successfully"
        })
    } catch(error) {
        logger.error("Error in updating product", error)
        res.status(500).json({
            error,
            message: "Not able to update product!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
}

exports.updateProductStatus = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        res.status(200).json({
            message: "Product status updated successfully"
        })
    } catch(error) {
        logger.error("Error in updating product status", error)
        res.status(500).json({
            error,
            message: "Not able to update product status!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
}


exports.delete = async function (req, res) {
    const dbConn = await db.getConnection()
    try {
        res.status(200).json({
            message: "Product deletion successfully"
        })
    } catch(error) {
        logger.error("Error in deleting product", error)
        res.status(500).json({
            error,
            message: "Not able to delete product!!"
        })
    } finally {
        db.releaseConnection(dbConn)
    }
}