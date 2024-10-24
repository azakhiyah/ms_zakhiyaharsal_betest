import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export any environment variables needed globally
export const config = {
    jwtSecret: process.env.key_secret,
    dbUri: process.env.mongo_url,
    port: process.env.port || 3000
};
