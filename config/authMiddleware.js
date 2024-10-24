import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const JWT_SECRET = config.jwtSecret;

export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET); // The token is typically sent as "Bearer <token>"
        req.user = decoded.userId; // Attach the user ID to request object for use in next middleware or controller
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
