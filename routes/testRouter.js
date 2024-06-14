import express from "express";
import { testFunction } from "../controller/test.controller";
import { authorizeRole, verifyToken } from "../middleware/verifyToken";
import { imageValidator, validator } from "../validator/validator";

const testRouter = express.Router();
testRouter.use(verifyToken);
testRouter.route("/image-upload").get(authorizeRole(["admin"]),imageValidator(/jpeg|jpg|png|heic/, ['licenseImages-R', 'portfolioImages-R']), validator(userSchema),  testFunction());
testRouter.route("/test").get(authorizeRole(["admin"]), testFunction());

module.exports = testRouter;
