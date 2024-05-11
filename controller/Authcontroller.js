const User = require("../model/Usermodel");
const SendMail = require("../controller/Sendmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, "456yfg", { expiresIn: '1h' });

        res.status(201).json({ user: newUser, token, message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, "456yfg", { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const time = new Date();
        time.setMinutes(time.getMinutes() + 10);
        await user.updateOne({ otp: hashedOtp, timeExpire: time });

        await SendMail(email, `Your OTP is: ${otp}`);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid User" });
        }

        const otpMatch = await bcrypt.compare(otp, user.otp);

        if (otpMatch && new Date() < user.timeExpire) {
            const hashedPass = await bcrypt.hash(password, 10);
            await user.updateOne({ password: hashedPass, otp: null, timeExpire: null });

            return res.status(200).json({ message: "Password reset successfully" });
        }
        return res.status(401).json({ message: "Invalid or expired OTP" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { login, register, forgotPassword, resetPassword };
