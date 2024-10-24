import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export environment variables yang dibutuhkan  global
export const config = {
    jwtSecret: process.env.key_secret,
    dbUri: process.env.mongo_url,
    port: process.env.port || 3000,
    redisHost:process.env.redis_host,
    redisPort:process.env.redis_port

};
