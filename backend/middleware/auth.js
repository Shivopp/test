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

// adminOnly must run AFTER protect — it relies on req.user, which protect
// populated from a verified JWT + a real database lookup. This can't be
// spoofed by editing localStorage, since it never trusts anything the
// client sends.
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = {
    protect,
    adminOnly,
}