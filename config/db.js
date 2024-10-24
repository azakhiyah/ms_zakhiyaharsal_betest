import mongoose from "mongoose";
import { config } from '../config/config.js';

const dbUri = config.dbUri;
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(dbUri);
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    } catch (error) {
        console.error(`error: ${error.message}`);
        process.exit(1);
    }
}