const chatModel = require("../models/chat.model");
const userModel = require("../models/user.model");

module.exports.accessChats = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if a chat already exists
        let isChat = await chatModel.findOne({
            isGroup: false,
            users: { $all: [req.user._id, userId] } // Directly using userId
        })
            .populate("users", "-password")
            .populate("latestMessage");

        if (isChat) {
            return res.status(200).json(isChat);
        }

        // If chat does not exist, create a new one
        const chatData = {
            chatName: "sender",
            isGroup: false,
            users: [req.user._id, userId] // Directly using userId
        };

        const createdChat = await chatModel.create(chatData);

        const fullChat = await chatModel
            .findOne({ _id: createdChat._id })
            .populate("users", "-password");

        res.status(200).json(fullChat);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};




module.exports.fetchChats = async (req, res) => {
    try {
        const chats = await chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessages")
            .sort({ updatedAt: -1 })
        res.status(200).json(chats)


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}



module.exports.createGroup = async (req, res) => {
    try {
        let { users, chatName } = req.body; // Use 'let' instead of 'const' for users

        if (!users || !chatName) {
            return res.status(400).json({ message: "Fill all the fields" });
        }

        console.log("Received users:", users);
        console.log("Type of users:", typeof users);

        // Ensure users is parsed only if it's a string
        if (typeof users === "string") {
            try {
                users = JSON.parse(users);
            } catch (error) {
                return res.status(400).json({ message: "Invalid users format" });
            }
        }

        // Ensure users is an array
        if (!Array.isArray(users)) {
            return res.status(400).json({ message: "Users must be an array" });
        }

        if (users.length < 2) {
            return res.status(400).json({ message: "A Group Should Have More than 2 users" });
        }

        users.push(req.user._id); // Add the current user to the group

        const groupChat = await chatModel.create({
            chatName,
            users,
            isGroup: true,
            groupAdmin: req.user._id
        });

        if (!groupChat) {
            return res.status(500).json({ message: "Failed to form Group. Try Again!" });
        }

        const fullGroupChat = await chatModel
            .findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(201).json({ message: "Group Chat Created", groupChat: fullGroupChat });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



module.exports.renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body

        const newChat = await chatModel.findOneAndUpdate(
            { _id: chatId },
            { chatName },
            { new: true },
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .lean()

        if (!newChat) {
            return res.status(500).json({ message: "Group Not Found" });
        }

        res.status(200).json({
            message: "Updated name successfully",
            newChat
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });

    }
}


module.exports.addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body

        const added = await chatModel.findOneAndUpdate({ _id: chatId }, { $push: { users: userId } }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!added) return res.status(500).json({ message: "Group Not Found" });

        res.status(200).json({
            message: "User Added to Group",
            added
        })






    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}



module.exports.removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        // console.log(chatId , userId)

        if (!chatId || !userId) {
            return res.status(400).json({ message: "chatId and userId are required" });
        }

        // Fetch group details
        const groupChat = await chatModel.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ message: "Group Not Found" });
        }

        // Check if the user leaving is the admin
        const isAdminLeaving = groupChat.groupAdmin.toString() === userId;

        if (isAdminLeaving) {
            // Get remaining users (excluding admin)
            const remainingUsers = groupChat.users.filter(user => user.toString() !== userId);

            if (remainingUsers.length === 0) {
                // If no other users remain, delete the group
                await chatModel.findByIdAndDelete(chatId);
                return res.status(200).json({ message: "Group deleted as the last admin left" });
            }

            // Select a random user from the remaining users
            const newAdmin = remainingUsers[Math.floor(Math.random() * remainingUsers.length)];

            // Update group: assign new admin and remove the leaving user
            const updatedChat = await chatModel.findByIdAndUpdate(
                chatId,
                { 
                    $pull: { users: userId }, 
                    groupAdmin: newAdmin
                },
                { new: true }
            )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .lean(); // Convert to plain object

            return res.status(200).json({
                message: `Admin left. New admin assigned: ${newAdmin}`,
                updatedChat
            });
        }

        // If a normal user is leaving, just remove them
        const updatedChat = await chatModel.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .lean();

        res.status(200).json({
            message: "User removed from Group",
            updatedChat
        });

    } catch (error) {
        console.error("Error in removeFromGroup:", error);
        res.status(500).json({ message: error.message });
    }
};
