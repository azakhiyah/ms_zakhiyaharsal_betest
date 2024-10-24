import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const JWT_SECRET = config.jwtSecret;

export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        // verifikasi Token
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET); 
        req.user = decoded.userId; 
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
