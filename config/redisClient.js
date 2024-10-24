import redis from 'redis';

let redisClient;

// Function untuk inisialisasi dan konek Redis client
const initializeRedisClient = () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: 'localhost', // Redis server URL
                port: 6379,        // default Redis port
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
