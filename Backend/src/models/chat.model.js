const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
        required: true,
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            
        },

    ],

    latestMessages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
    {
        timestamps: true
    }
)

const chatModel = mongoose.model("Chat",ChatSchema)

module.exports = chatModel