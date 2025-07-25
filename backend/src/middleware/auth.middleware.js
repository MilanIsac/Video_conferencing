import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if(!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}