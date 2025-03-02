const express = require('express');
const router = express.Router();
const chatControllers = require("../controller/chat.controller")
const userMiddleware = require("../middleware/user.middleware")
// Define your routes here

router.post('/', userMiddleware.authUser, chatControllers.accessChats);
// router.get('/'  ,chatControllers.fetchChats )
// router.post("/group" ,userMiddleware.authUser,chatControllers.createGroup )
// router.put("/rename" ,userMiddleware.authUser,chatControllers.renameGroup )
// router.put("/groupremove" ,userMiddleware.authUser,chatControllers.removeFromGroup )
// router.put("/groupadd" ,userMiddleware.authUser,chatControllers.addToGroup )



module.exports = router;