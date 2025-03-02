const express = require('express');
const router = express.Router();
const chatControllers = require("../controller/chat.controller")
const userMiddleware = require("../middleware/user.middleware")
// Define your routes here

router.post('/', userMiddleware.authUser, chatControllers.accessChats);
//fetching all chats for the Particuler User
router.get('/', userMiddleware.authUser, chatControllers.fetchChats)
//Creating a Group Chat
router.post("/group" ,userMiddleware.authUser,chatControllers.createGroup )
//renaming a Specific Group Chat 
router.put("/rename" ,userMiddleware.authUser,chatControllers.renameGroup )
//add a user to a specific Froup Chat 
router.put("/groupadd" ,userMiddleware.authUser,chatControllers.addToGroup )
// delete a user to a specific Froup Chat
router.put("/groupremove" ,userMiddleware.authUser,chatControllers.removeFromGroup )



module.exports = router;