import mongoose from 'mongoose';
import logger from "./logger.js";
import config from './index.js';

const connectDB = async () => {
    try {
        await mongoose.connect(config.database.uri);
        logger.http("MongoDB Connected Successfully");
    } catch (error) {
        logger.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        logger.http("MongoDB Disconnected Successfully");
    } catch (error) {
        logger.error("Error Disconnecting MongoDB:", error);
    }
}

export { connectDB, closeDB };