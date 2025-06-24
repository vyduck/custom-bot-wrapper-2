import { createLogger } from 'winston';
/**
 * Logger class for logging messages at various levels using Winston.
 */
export declare class Logger {
    logger: ReturnType<typeof createLogger>;
    /**
     * Create a new Logger instance.
     */
    constructor(options?: {
        level?: string;
        filePath?: string;
        customStreams?: Array<any>;
    });
    /**
     * Log a debug message.
     */
    debug(msg: string): void;
    /**
     * Log an info message.
     */
    info(msg: string): void;
    /**
     * Log a warning message.
     */
    warn(msg: string): void;
    /**
     * Log an error message.
     */
    error(msg: string): void;
}
