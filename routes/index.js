import express from "express";

const testRouter = require('./testRouter')
const routes = express.Router();

routes.use('/test', testRouter)


module.exports = routes