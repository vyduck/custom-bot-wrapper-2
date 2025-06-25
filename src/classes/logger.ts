import { createLogger, format, transports } from 'winston';

/**
 * Logger class for logging messages at various levels using Winston.
 */
export class Logger {
    logger: ReturnType<typeof createLogger>;

    /**
     * Create a new Logger instance.
     */
    constructor(options: { level?: string; filePath?: string; customStreams?: Array<any>; } = {}) {
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
                ...customStreams
            ]
        });
    }

    /**
     * Log a debug message.
     */
    debug(msg: string) {
        this.logger.debug(msg);
    }

    /**
     * Log an info message.
     */
    info(msg: string) {
        this.logger.info(msg);
    }

    /**
     * Log a warning message.
     */
    warn(msg: string) {
        this.logger.warn(msg);
    }

    /**
     * Log an error message.
     */
    error(msg: string) {
        this.logger.error(msg);
    }
}