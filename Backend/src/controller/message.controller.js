const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")

module.exports.sendMessageController = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json({ message: "Invalid Data Passed into Request" });
        }

        let newMessage = await messageModel.create({
            sender: req.user._id,
            content,
            chatId
        });

        newMessage = await newMessage.populate([
            { path: "sender", select: "name picture" },
            { path: "chatId", populate: { path: "users", select: "name picture email" } }
        ]);

        await chatModel.findByIdAndUpdate(chatId, {
            latestMessage: newMessage._id
        });

        res.status(201).json({ message: newMessage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};





module.exports.allMessagesOfChat = async (req, res) => {
    try {
        const messages = await messageModel.find({ chatId: req.params.chatId }).populate("sender","name picture email").populate("chatId")
        if(!messages) return res.status(400).json({message : "Chat was not Found with requested ChatId "})

        res.status(200).json({messages})    


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}