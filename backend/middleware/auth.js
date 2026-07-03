const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
// import { AppError } from "./errorHandler.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Not authorized" });
        }
        next(error);
    }
};

// export const signToken = (userId) =>
//     jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports = {
    protect,
}