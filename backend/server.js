import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.js";
import config from "./config/index.js";
import ApiError from "./utils/ApiError.js";
import errorHandler from "./middleware/error.js";
import { closeDB, connectDB } from "./config/db.js";

// Import routes
import v1Route from './routes/index.js';

dotenv.config();

const app = express();

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Custom HTTP logging middleware using Winston
app.use((req, res, next) => {
    const start = Date.now();

    const originalEnd = res.end;

    res.end = function (...args) {
        const duration = Date.now() - start;

        // Get real IP address (handle proxies and IPv6)
        const clientIP = req.ip === '::1' ? 'localhost' :
            req.ip === '::ffff:127.0.0.1' ? 'localhost' :
                req.ip;

        // Enhanced log format with better structure
        const logMessage = `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms | IP: ${clientIP} | User-Agent: ${req.get('User-Agent') || 'Unknown'}`;

        if (res.statusCode >= 400) {
            logger.warn(logMessage);
        } else {
            logger.http(logMessage);
        }

        originalEnd.apply(this, args);
    };

    next();
});

// Database connection
await connectDB();

// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Civic Issue Reporter API is running...",
        version: "1.0.0",
        environment: config.NODE_ENV
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use("/v1", v1Route)

// 404 handler - catch all unmatched routes
app.use((req, res, next) => {
    next(new ApiError(404, "Route not found", "NOT_FOUND", "The requested route does not exist."));
});

// Global error handler
app.use(errorHandler);
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    await closeDB();
    process.exit(0);
});

process.on("SIGINT", async () => {
    logger.info("SIGINT received. Shutting down gracefully...");
    await closeDB();
    process.exit(0);
});


app.use(errorHandler);
const PORT = config.PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
});
