const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
const config = require("../config/config");
import User from "../model/userModel";
import { Responses } from "./responses";
import { messageID, messages } from "../config/constants";

const { JWT_EXPIRATION_IN_MINUTES, JWT_SECRET, OTP_EXPIRATION } = config.config;

const generateToken = (payload) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * JWT_EXPIRATION_IN_MINUTES;

  /**
   * Generates a JSON Web Token (JWT) with the provided payload and expiration date.
   * @param {object} payload - The data to be included in the token.
   * @param {number} expiration - The expiration time for the token.
   * @returns {string} A signed JWT token.
   */
  return jwt.sign(
    {
      data: payload,
      exp: expiration,
    },
    JWT_SECRET
  );
};

/**
 * Generates a refresh token using the provided payload.
 * @param {object} payload - The data to be included in the token.
 * @returns {string} A refresh token signed with the JWT_SECRET and set to expire in JWT_EXPIRATION_IN_MINUTES minutes.
 */
const generateRefreshToken = (payload) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * JWT_EXPIRATION_IN_MINUTES + 120;

  // returns signed token
  return jwt.sign(
    {
      data: payload,
      exp: expiration,
    },
    JWT_SECRET
  );
};

const isEmpty = (value) => {
  return (
    value == "" ||
    value == null ||
    value == undefined ||
    value.toString().replace(/\s/g, "") == ""
  );
};

/**
 * Hashes a plaintext password using bcrypt with a salt round of 10.
 * @param {string} plaintextPassword - The plaintext password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hashPassword = async (plaintextPassword) => {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
};

/**
 * Compare a plaintext password with a hashed password using bcrypt.
 * @param {string} plaintextPassword - The plaintext password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {boolean} A boolean indicating whether the plaintext password matches the hashed password.
 */

const comparePassword = async (plaintextPassword, hash) => {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
};

/**
 * Generates a 4-digit one-time password (OTP) consisting of numbers 0-9.
 * @returns {string} A randomly generated 4-digit OTP.
 */
const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


/**
 * Calculates the expiration time for a One-Time Password (OTP) based on the given number of minutes.
 * If no minutes are provided, the default OTP_EXPIRATION value is used.
 * @param {number} [minutes=OTP_EXPIRATION] - The number of minutes until the OTP expires.
 * @returns {Date} - The date and time when the OTP will expire.
 */
const calculateOtpExpiration = (minutes = OTP_EXPIRATION) => {
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + minutes);
  return otpExpiration;
};


/**
 * Validates the required fields in a given object.
 * @param {Array} fields - An array of fields to validate.
 * @param {Object} res - The response object to return in case of validation failure.
 * @returns {Object|null} Returns a response object with a 400 status code if any required field is missing, otherwise returns null.
 */
const validateRequiredFields = (fields, res) => {
  for (const field of fields) {
    if (!field.value) {
      return Responses._400(res, {
        status:false,
        data: [],
        message: messages.requiredFields,
      });
    }
  }
  return null;
};


/**
 * Check if a user with the given email exists and is not deleted in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<User>} A promise that resolves to the user object if found, otherwise null.
 */
const checkUserExistenceForAll = async (email) => {
  return await User.findOne({ email, isDeleted: false ,isEmailVerified:true });
};

/**
 * Validates the request body against a Joi schema and returns an error response if validation fails.
 * @param {Joi.Schema} schema - The Joi schema to validate the request body against.
 * @param {object} body - The request body to validate.
 * @param {object} res - The response object to send error response.
 * @returns {object | null} Returns an error response object if validation fails, otherwise returns null.
 */
const validateRequest = (schema, body, res) => {
  const { error } = schema.validate(body, { abortEarly: false });
  if (error) {
    return Responses._400(res, {
      status: false,
      message: error.details.map((detail) => detail.message).join(", "),
      data: [],
    });
  }
  return null;
};

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function convertToISOString(dateString) {
  // Parse the input date string
  const [day, month, year] = dateString.split(' ');

  // Define month names to convert month abbreviations to numbers
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = monthNames.indexOf(month);

  // Create a new Date object with the parsed date and fixed time in UTC
  const date = new Date(Date.UTC(year, monthIndex, day, 8, 59, 0, 0));

  // Format the date to ISO string
  const formattedDate = date.toISOString();

  // Return the formatted date string
  return formattedDate;
}
module.exports = {
  generateToken,
  generateRefreshToken,
  isEmpty,
  hashPassword,
  generateOTP,
  calculateOtpExpiration,
  validateRequiredFields,
  checkUserExistenceForAll,
  comparePassword,
  validateRequest,
  generateRandomString,
  convertToISOString
};
