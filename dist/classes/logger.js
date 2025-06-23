import { createLogger, format, transports } from 'winston';
/**
 * Logger class for logging messages at various levels using Winston.
 */
export class Logger {
    logger;
    /**
     * Create a new Logger instance.
     */
    constructor(options = {}) {
        const { level = 'info', filePath = 'bot.log', customStreams = [] } = options;
        // Define custom log levels
        const levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
        };
        // Winston logger instance
        this.logger = createLogger({
            levels,
            level,
            format: format.combine(format.timestamp({ format: 'MM-DD HH:mm:ss' }), format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
            transports: [
                new transports.Console({ level: 'info' }),
                new transports.File({ filename: filePath, level: 'debug' }),
                ...customStreams
            ]
        });
    }
    /**
     * Log a debug message.
     */
    debug(msg) {
        this.logger.debug(msg);
    }
    /**
     * Log an info message.
     */
    info(msg) {
        this.logger.info(msg);
    }
    /**
     * Log a warning message.
     */
    warn(msg) {
        this.logger.warn(msg);
    }
    /**
     * Log an error message.
     */
    error(msg) {
        this.logger.error(msg);
    }
}
