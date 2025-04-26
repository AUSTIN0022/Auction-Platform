import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const app = express();

dotenv.config();

import { User } from './model/DBModel.js';

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login Route
app.post("/api/auth/admin/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password"
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email, role: 'admin' });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account has been deactivated"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
});

// Registration Route
app.post("/api/auth/admin/register", async (req, res) => {
    const { name, email, password, matchPassword, mobile, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !matchPassword || !mobile) {
        return res.status(400).json({ 
            success: false,
            message: "Please fill all required fields" 
        });
    }

    // Check if passwords match
    if (password !== matchPassword) {
        return res.status(400).json({ 
            success: false,
            message: "Passwords do not match" 
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            address,
            role: 'admin',
            verified: false,
            verifyStatus: 'pending'
        });

        // Debug output
        console.log("Attempting to save user:", JSON.stringify(newUser, null, 2));

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: newUser._id,
                role: newUser.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully. Awaiting verification.",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Registration error details:", error.message);
        console.error("Error stack:", error.stack);
        
        return res.status(500).json({
            success: false,
            message: `Registration error: ${error.message}`
        });
    }
});

// Additional middleware for admin authentication
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify this is an admin user
        const user = await User.findById(decoded.userId);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }
        
        req.user = {
            id: user._id,
            role: user.role,
            email: user.email
        };
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


app.listen(process.env.PORT, () => {
    console.log(`listening on port http://localhost:${process.env.PORT}.....`);
});