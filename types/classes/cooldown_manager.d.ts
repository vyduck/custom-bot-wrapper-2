/**
 * Manages cooldowns for commands and users.
 */
export declare class CooldownManager {
    commands: Map<string, [number, number]>;
    cooldowns: Map<string, any>;
    /**
     * Sweeper configuration for cleaning up expired cooldowns.
     */
    sweeper: {
        interval: number;
        active: boolean;
        intervalId: NodeJS.Timeout | null;
    };
    /**
     * Create a new CooldownManager and starts the sweeper.
     * @param {number} [sweeperInterval=1000*60*5] - Interval in ms for sweeping expired cooldowns.
     */
    constructor(sweeperInterval?: number);
    /**
     * Check and tick the cooldown for a given key.
     * @param {string} key - Format: cName:guildId:userId
     * @returns {number} Remaining cooldown in ms, or 0 if not on cooldown.
     */
    check(key: string): number;
    /**
     * Register a command's cooldown settings.
     */
    addCommand(cName: string, [limitPerPeriod, periodInSeconds]: [number, number]): void;
    /**
     * Start the sweeper to clean up expired cooldowns.
     */
    startSweeper(): void;
    /**
     * Stop the sweeper.
     */
    stopSweeper(): void;
}
