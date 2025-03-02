const express = require("express")
const router = express.Router()
const multer = require("../services/multer")
const userMiddleware = require("../middleware/user.middleware")
const userControllers = require("../controller/user.controller")

router.post("/register",multer.handelFileUpload, userControllers.registerController)
router.post("/login", userControllers.loginController)

router.get("/search" ,userMiddleware.authUser,userControllers.searchUser)


module.exports=router