import { createLogger, format, transports } from 'winston';

export class Logger {
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

    debug(msg) {
        this.logger.debug(msg);
    }

    info(msg) {
        this.logger.info(msg);
    }

    warn(msg) {
        this.logger.warn(msg);
    }

    error(msg) {
        this.logger.error(msg);
    }
}