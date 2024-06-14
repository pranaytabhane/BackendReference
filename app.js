const express = require('express');
const cors = require('cors')
const { initiateMongoConnection } = require('./config/db');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');

const app = express();
/**
 * Initiates a connection to a MongoDB database.
 * @returns None
 */
initiateMongoConnection();

/**
 * Enable Cross-Origin Resource Sharing (CORS) for all origins.
 * @param {Object} options - Configuration options for CORS.
 * @param {string} options.origin - The allowed origin for CORS requests.
 * @returns None
 */
app.use(cors({ origin: "*" }));

/**
 * Middleware function to handle file uploads in the application.
 * @returns None
 */
app.use(fileUpload());

/**
 * Mounts the middleware function to parse JSON bodies for the Express app.
 * @param {object} options - The options object for the JSON parser.
 * @param {string} options.limit - The maximum size of JSON body that can be parsed (in this case, "50mb").
 */
app.use(express.json({ limit: "50mb" }));

/**
 * Middleware that parses urlencoded bodies with a limit of 50mb and does not support nested objects.
 * @param {object} bodyParser.urlencoded - The middleware function for parsing urlencoded bodies.
 * @param {string} limit - The size limit of the body. In this case, it is set to 50mb.
 * @param {boolean} extended - Indicates whether to use the extended syntax (true) or not (false).
 */
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

/**
 * Middleware that parses incoming request bodies in JSON format.
 * @param {object} options - Configuration options for parsing JSON.
 * @param {string} options.limit - The maximum size of the JSON body.
 * @returns None
 */
app.use(bodyParser.json({ limit: "50mb" }));

/**
 * Mounts the specified middleware function or router at the specified path.
 * @param {string} path - The path at which the middleware function or router will be mounted.
 * @param {Router} routes - The middleware function or router to be mounted.
 */
app.use("/api/", routes);

/**
 * Middleware function to handle 404 Not Found errors.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns None
 */
app.use(notFound);

/**
 * Middleware function to handle errors in the application.
 * @param {Function} errorHandler - The error handling function to be used by the application.
 * @returns None
 */
app.use(errorHandler);

export default app;
