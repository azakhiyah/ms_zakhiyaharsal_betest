import redis from 'redis';

let redisClient;

// Function to initialize and connect Redis client
const initializeRedisClient = () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: 'localhost', // or Redis server URL
                port: 6379,        // default Redis port
            }
        });

        // Error handling
        redisClient.on('error', (err) => {
            console.error("Redis error:", err);
        });

        // Connect the client and handle connection errors
        redisClient.connect().catch((err) => {
            console.error('Error connecting to Redis:', err);
        });
    }
    return redisClient;
};

// Call the function to initialize Redis client
initializeRedisClient();

export default redisClient;
