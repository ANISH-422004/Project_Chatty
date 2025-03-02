const chatModel = require("../models/chat.model");
const userModel = require("../models/user.model");

module.exports.accessChats = async (req, res) => {
    try {
        const { userId } = req.body;

        let isChat = await chatModel.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
        .populate("users", "-password")
        .populate("latestMessages");

        isChat = await userModel.populate(isChat, {
            path: "latestMessages.sender",
            select: "name email picture"
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false, 
                users: [req.user._id, userId]
            };

            const createdChat = await chatModel.create(chatData);

            const FullChat = await chatModel
                .findOne({ _id: createdChat._id }) 
                .populate("users", "-password");

            res.status(200).json(FullChat);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
