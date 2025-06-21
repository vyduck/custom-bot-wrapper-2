import { createLogger, format, transports } from 'winston';

/**
 * Logger class for logging messages at various levels using Winston.
 */
export class Logger {
    /**
     * Create a new Logger instance.
     * @param {Object} [options] - Logger options.
     * @param {string} [options.level='info'] - Minimum log level.
     * @param {string} [options.filePath='bot.log'] - File path for log file.
     * @param {Array} [options.customStreams=[]] - Additional custom Winston transports.
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
            format: format.combine(
                format.timestamp({ format: 'MM-DD HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new transports.Console({ level: 'info' }),
                new transports.File({ filename: filePath, level: 'debug' }),
                ...customStreams
            ]
        });
    }

    /**
     * Log a debug message.
     * @param {string} msg - The message to log.
     */
    debug(msg) {
        this.logger.debug(msg);
    }

    /**
     * Log an info message.
     * @param {string} msg - The message to log.
     */
    info(msg) {
        this.logger.info(msg);
    }

    /**
     * Log a warning message.
     * @param {string} msg - The message to log.
     */
    warn(msg) {
        this.logger.warn(msg);
    }

    /**
     * Log an error message.
     * @param {string} msg - The message to log.
     */
    error(msg) {
        this.logger.error(msg);
    }
}