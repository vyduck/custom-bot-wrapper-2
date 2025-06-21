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
    constructor(options?: {
        level?: string;
        filePath?: string;
        customStreams?: any[];
    });
    logger: import("winston").Logger;
    /**
     * Log a debug message.
     * @param {string} msg - The message to log.
     */
    debug(msg: string): void;
    /**
     * Log an info message.
     * @param {string} msg - The message to log.
     */
    info(msg: string): void;
    /**
     * Log a warning message.
     * @param {string} msg - The message to log.
     */
    warn(msg: string): void;
    /**
     * Log an error message.
     * @param {string} msg - The message to log.
     */
    error(msg: string): void;
}
