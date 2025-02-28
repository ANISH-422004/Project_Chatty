const userModel = require("../models/user.model")
const imageKit = require("../services/imageKit")
module.exports.registerController = async (req, res) => {
    try {
        const { name, email, password, picture } = req.body

        if (!name || !email || !password) {
            throw new Error("please Enter All fields")
        }

        const userExist = await userModel.findOne({ email })

        if (userExist) {
            console.log(userExist)
            res.status(400)
            throw new Error("userModel Already Exists")
        }
        const h_pass = await userModel.hashPassword(password)
        console.log(req.file)
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const uploadedMedia = await imageKit.uploadBufferStream(fileBuffer, fileName);

        const newUser = await userModel.create({
            name,
            email,
            password: h_pass,
            picture:uploadedMedia.url,

        })

        const token = newUser.generateAuthToken()

        if (newUser) {
            res.status(201).json({

                newUser: newUser,
                token: token
            })
        } else {
            throw new Error("Failed to create user")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await userModel.findOne({ email });

        if (!user || !(await userModel.comparePassword(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.status(200).json({
            user,
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};
