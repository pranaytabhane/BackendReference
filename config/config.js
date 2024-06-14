import 'dotenv/config.js';
/**
 * Configuration object containing various settings such as database connection details,
 * server port, email configuration, JWT secret, JWT expiration time, and Node environment.
 * Defaults to local settings if environment variables are not provided.
 * @type {Object}
 * @property {Object} DB - Database configuration object
 * @property {string} DB.HOST - Database host address
 * @property {string} DB.PORT - Database port number
 * @property {string} DB.DATABASE - Database name
 * @property {string} DB.USERNAME - Database username
 * @property {string} DB.PASSWORD - Database password
 * @property {string} PORT - Server port number
 * @property {Object} EMAIL - Email configuration object
 */
export const config = {
  DB: {
    HOST: process.env.MONGO_DB_HOST || "127.0.0.1",
    PORT: process.env.MONGO_DB_PORT || "27017",
    DATABASE: process.env.MONGO_DATABASE || "dbname",
    USERNAME: process.env.MONGO_USER || "",
    PASSWORD: process.env.MONGO_PASSWORD || "",
  },
  PORT: process.env.PORT,
  EMAIL: {
    host: "smtp.gmail.com",
    user: process.env.SEND_MAIL_AUTH_USER || "youremail@gmail.com",
    password: process.env.SEND_MAIL_AUTH_PASSWORD || "password",
  },
  JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
  JWT_EXPIRATION_IN_MINUTES: process.env.JWT_EXPIRATION_IN_MINUTES || 1440,
  OTP_EXPIRATION: process.env.OTP_EXPIRATION || 5,
  NODE_ENV: process.env.NODE_ENV || "local",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || ""
};
