import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // for hashing
import mongoose from 'mongoose';
import { config } from '../config/config.js';


const JWT_SECRET = config.jwtSecret;

//loginn users
export const loginUser = async (req, res) => {
    const { emailAddress, password } = req.body;

    // Check if both email and password are provided
    if (!emailAddress || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ emailAddress });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { userName, accountNumber, emailAddress, identityNumber, password } = req.body; // Expect user data in the request body

    // Check for required fields
    if (!userName || !accountNumber || !emailAddress || !identityNumber || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user object with hashed password
        const newUser = new User({
            userName,
            accountNumber,
            emailAddress,
            identityNumber,
            password: hashedPassword // Store the hashed password
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in creating user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error in fetching user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error in updating user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error in deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
