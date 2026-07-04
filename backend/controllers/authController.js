const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User')
dotenv.config();


async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Invalid User Data" })
        }
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already registered with this email" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role}
        });
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate fresh JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
async function loginAdmin(req,res){
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isAdmin = (user.role === "admin");
        if(!isAdmin){
            return res.status(400).json({message:"Invalid email or password"});
        }
        
        // Generate fresh JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role}
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMe(req, res) {
    // req.user is populated by the `protect` middleware from a verified JWT
    // + a fresh database lookup — this is the ONLY safe source of truth for
    // role. Never trust a `role` value sent by the client itself.
    const user = req.user;
    res.json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
}

module.exports = {
    loginUser, registerUser, loginAdmin, getMe
}