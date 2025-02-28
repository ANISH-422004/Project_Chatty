const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const config = require("../config/config")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    picture: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
}, { timestamps: true })


// Instance method to generate JWT
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id , email:this.email , name : this.name}, config.JWT_SECRET, {
        expiresIn: '3d', 
    });
    return token;
};

// 🔹 **Static Method:** Hash Password (Works on the model level)
userSchema.statics.hashPassword = async function (password) {
    if (!password) throw new Error("Password is required")
    return await bcrypt.hash(password, 10);
};



// Static method to compare passwords
userSchema.statics.comparePassword = async function (candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};


const userModel = mongoose.model("User", userSchema)

module.exports = userModel