import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export environment variables yang dibutuhkan  global
export const config = {
    jwtSecret: process.env.key_secret,
    dbUri: process.env.MONGO_URI,
    port: process.env.port || 3000,
    redisHost:process.env.REDIS_HOST,
    redisPort:process.env.REDIS_PORT

};
