const express = require("express");
const authController = require("../controllers/auth-controller");
const { registerSchema, loginSchema, validateWithZod } = require("../middlewares/validators");
const authRouter = express.Router();


authRouter.post("/register",validateWithZod(registerSchema) , authController.register);
authRouter.post("/login" , validateWithZod(loginSchema) , authController.login);

module.exports = authRouter;