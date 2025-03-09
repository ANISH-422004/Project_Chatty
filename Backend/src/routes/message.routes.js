const { authUser } = require("../middleware/user.middleware")
const messageControllers = require("../controller/message.controller")
const router = require("express").Router()


//for sending messages
router.post("/",authUser , messageControllers.sendMessageController)
// for getting all messages for a single chat 
router.get("/:chatId" , authUser , messageControllers.allMessagesOfChat)


module.exports=router