import redis from 'redis';
import { config } from '../config/config.js';

let redisClient;

const hostRedis = config.redisHost;
const portRedis = config.redisPort;

// Function untuk inisialisasi dan konek Redis client
const initializeRedisClient = () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: hostRedis, // Redis server URL
                port: portRedis, // default Redis port
            }
        });

        // Error handling
        redisClient.on('error', (err) => {
            console.error("Redis error:", err);
        });

        // konek client dan menangani koneksi errors
        redisClient.connect().catch((err) => {
            console.error('Error connecting to Redis:', err);
        });
    }
    return redisClient;
};

// memanggil function untuk inisialisasi Redis client
initializeRedisClient();

export default redisClient;
