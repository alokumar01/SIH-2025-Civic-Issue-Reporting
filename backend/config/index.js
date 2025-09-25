import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,

    database: {
        uri: process.env.NODE_ENV === 'production'
            ? process.env.MONGODB_URI_PROD
            : process.env.MONGODB_URI,
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expire: process.env.JWT_EXPIRE || '7d',
        cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },

    email: {
        from: process.env.EMAIL_FROM || 'noreply@civicreporting.com',
        smtp: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        }
    },

    security: {
        bcryptRounds: 12,
        maxLoginAttempts: 5,
        lockoutTime: 2 * 60 * 60 * 1000,
        passwordResetExpire: 10 * 60 * 1000,
        emailVerificationExpire: 24 * 60 * 60 * 1000
    },

    geolocation: {
        defaultRadius: 1000,
        maxRadius: 50000
    },
};

const validateConfig = () => {
    const required = [
        'JWT_SECRET',
        'MONGODB_URI'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        logger.error('Missing required environment variables:', missing.join(', '));
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }

    if (process.env.NODE_ENV === 'production') {
        if (config.jwt.secret === 'fallback-secret-change-in-production') {
            logger.warn('Using fallback JWT secret in production!');
        }
    }
};

validateConfig();

export default config;