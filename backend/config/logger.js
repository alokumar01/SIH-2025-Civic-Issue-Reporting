import { createLogger, format, transports } from "winston";

const { combine, timestamp, colorize, printf, align } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] : ${stack || message}`;
});

const logger = createLogger({
    level: "debug", // adjust as needed
    format: combine(
        colorize({ all: true }), // colorize everything
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        logFormat
    ),
    transports: [
        new transports.Console({
            handleExceptions: true
        })
    ],
    exitOnError: false
});

export default logger;
