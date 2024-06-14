import jwt from "jsonwebtoken";
import { messageID, messages } from "../config/constants";
import { config } from "../config/config";
import { Responses } from "./responses";
const { JWT_SECRET } = config;

/**
 * Verifies the token in the request header and handles different scenarios based on the token validity.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns None
 */
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token) return Responses._401(res, {
            status: false,
            message: messages.authError,
            body: null,
        });
        token = token.split('Bearer ')[1];
        let jwtSecretKey = JWT_SECRET;
        const decode = jwt.verify(token, jwtSecretKey);
        req.user = decode.data
        next();
    } catch (error) {
        if (error.name == "TokenExpiredError") {
          return Responses._401(res, {
            status: false,
            message: messages.tokenExpire,
            body: null,
          })
        }
        Responses._401(res, {
            status: false,
            message: messages.invalidToken,
            body: null,
        });
    }
};

/**
 * Authorize a role based on the provided role parameter.
 * @param {string} role - The role to authorize.
 * @returns A middleware function that checks if the user's role is authorized and make sure whether he has access to that API or not.
 */
export const authorizeRole = (role) => {
    // this function
    return (req, res, next) => {

        if (!role.includes(req.user.role)) {
            return Responses._401(res, { 
                status: false,
                message: messages.notAuthorized,
                data: null,
            });
        }
        next();
    };
};
