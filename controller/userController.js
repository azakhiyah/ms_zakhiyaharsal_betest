import User from '../models/userModel.js';
import redisClient from '../config/redisClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // for hashing
import mongoose from 'mongoose';
import { config } from '../config/config.js';


const JWT_SECRET = config.jwtSecret;

//login users
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

// untuk mendapatkan semua user
export const getUsers = async (req, res) => {
    try {
        // Check if users data is in Redis cache
        const cachedUsers = await redisClient.get('users');
        
        if (cachedUsers) {
            // If cached data exists, return it
            console.log('Serving from cache');
            return res.status(200).json({ success: true, data: JSON.parse(cachedUsers) });
        } 

        // Fetch data from MongoDB if not cached
        const users = await User.find({});

        // Cache the data in Redis for 1 hour (3600 seconds)
        await redisClient.setEx('users', 3600, JSON.stringify(users));

        // Return the fresh data
        return res.status(200).json({ success: true, data: users });
        
    } catch (error) {
        console.error("Error in fetching users:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// untuk mendaftarkan user
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

        // Cache the new user data in Redis
        await redisClient.set(`user:${newUser._id}`, JSON.stringify(newUser), 'EX', 3600); // Cache for 1 hour

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in creating user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// untuk mendapatkan user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        // Check if user data is in Redis cache
        const cachedUser = await redisClient.get(`user:${id}`);

        if (cachedUser) {
            // If user data is found in cache, return it
            console.log('Serving from cache');
            return res.status(200).json({ success: true, data: JSON.parse(cachedUser) });
        } else {
            // Fetch user data from MongoDB
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Store the user data in Redis cache with an expiration time
            await redisClient.setEx(`user:${id}`, 3600, JSON.stringify(user)); // Cache for 1 hour (3600 seconds)

            // Return the user data from database
            return res.status(200).json({ success: true, data: user });
        }
    } catch (error) {
        console.error("Error in fetching user:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// untuk Update user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // After updating user in database, update Redis cache
        await redisClient.set(`user:${id}`, JSON.stringify(updatedUser)); // Update cache
        // Optionally, you can set an expiration time using a separate command
        await redisClient.expire(`user:${id}`, 3600); // Cache for 1 hour

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error in updating user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// untuk menghapus user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Remove the user from Redis cache
        redisClient.del(`user:${id}`);

        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error in deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
