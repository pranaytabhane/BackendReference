import mongoose from "mongoose";
import 'dotenv/config'
const config = require("./config")
const { DB } = config.config

/**
 * Configuration options for connecting to a database.
 * @type {object}
 * @property {string} user - The username for the database connection.
 * @property {string} pass - The password for the database connection.
 */
var options = {
    user: DB.USERNAME,
    pass: DB.PASSWORD,
}
/**
 * MongoDB connection URI.
 * @type {string}
 */
const MONGOURI= `mongodb://${DB.HOST}:${DB.PORT}/${DB.DATABASE}`

/**
 * Initiates a connection to a MongoDB database using Mongoose.
 * @returns {Promise<void>} A promise that resolves once the connection is established.
 * @throws {Error} If there is an error connecting to the database.
 */
export const initiateMongoConnection = async()=>{
    try{
        await mongoose.connect(MONGOURI,options);
        console.log("Connected to DB");
    } catch(e){
        throw e
    }
}