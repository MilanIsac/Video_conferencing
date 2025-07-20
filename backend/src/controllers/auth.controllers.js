import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: 'Password must be at least 5 characters long' });
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const profile_pic = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            username,
            password,
            email,
            profile_pic,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.username,
                image: newUser.profile_pic || "",
            });
            console.log('Stream user upserted successfully');
        }
        catch (error) {
            console.error('Error upserting Stream user:', error);
            return res.status(500).json({ message: 'Failed to create Stream user' });
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict', // prevent CSRF attacks
            httpOnly: true, // prevent XSS attacks
        });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            token,
        });

    } catch (error) {
        console.error('Error during signup controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        console.error('Error during login controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export function logout(req, res) {
    res.clearCookie('token', {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { username, bio, location } = req.body;
        if (!username || !bio || !location) {
            return res.status(400).json({
                message: 'All fields are required',
                missingFields: [
                    !username && "name",
                    !bio && "bio",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // update user info in stream

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.username,
                image: updatedUser.profile_pic || "",
            });
            console.log(`Stream user updated successfully: ${updatedUser.username}`);
        }
        catch (error) {
            console.error('Error updating Stream user:', error);
            return res.status(500).json({ message: 'Failed to update Stream user' });
        }

        res.status(200).json({
            message: 'User onboarded successfully',
            user: updatedUser,
        });

    }
    catch (error) {
        console.error('Error during onboarding:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}