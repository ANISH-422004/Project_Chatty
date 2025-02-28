const express = require("express")
const router = express.Router()
const multer = require("../services/multer")
const userControllers = require("../controller/user.controller")

router.post("/register",multer.handelFileUpload, userControllers.registerController)
router.post("/login", userControllers.loginController)


module.exports=router