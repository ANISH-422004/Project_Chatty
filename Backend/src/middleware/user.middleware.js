const userModel = require("../models/user.model");


module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded_token = await userModel.verifyToken(token);

        if (!decoded_token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await userModel.findById(decoded_token._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        req.tokenData = { token, ...decoded_token };

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message || "Unauthorized" });
    }
};
