const userModel = require("../models/user.model");
const imageKit = require("../services/imageKit");

module.exports.registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new Error("Please enter all fields");
        }

        const userExist = await userModel.findOne({ email });

        if (userExist) {
            console.log(userExist);
            res.status(400);
            throw new Error("User already exists");
        }

        const h_pass = await userModel.hashPassword(password);
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const uploadedMedia = await imageKit.uploadBufferStream(fileBuffer, fileName);

        const newUser = await userModel.create({
            name,
            email,
            password: h_pass,
            picture: uploadedMedia.url,
        });

        const token = newUser.generateAuthToken();

        if (newUser) {
            res.status(201).json({
                newUser: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    picture: newUser.picture,
                },
                token: token,
            });
        } else {
            throw new Error("Failed to create user");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Fetch user including password for comparison
        const user = await userModel.findOne({ email });

        if (!user || !(await userModel.comparePassword(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = user.generateAuthToken();

        // Exclude password before sending the user object
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.searchUser = async (req, res) => {
    try {
        const keyword = req.query.search;

        const users = await userModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { email: { $regex: keyword, $options: "i" } },
                ],
                _id: { $ne: req.tokenData._id },
            })
            .select("-password"); // Exclude password from response

        console.log(req.tokenData._id);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
 