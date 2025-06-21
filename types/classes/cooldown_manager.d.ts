/**
 * Manages cooldowns for commands and users.
 */
export class CooldownManager {
    /**
     * Create a new CooldownManager.
     * @param {number} [sweeperInterval=1000*60*5] - Interval in ms for sweeping expired cooldowns.
     */
    constructor(sweeperInterval?: number);
    /** @type {Map<string, [number, number]>} */
    commands: Map<string, [number, number]>;
    /** @type {Map<string, any>} */
    cooldowns: Map<string, any>;
    /**
     * Sweeper configuration for cleaning up expired cooldowns.
     * @type {{ interval: number, active: boolean, intervalId: NodeJS.Timeout | null }}
     */
    sweeper: {
        interval: number;
        active: boolean;
        intervalId: NodeJS.Timeout | null;
    };
    /**
     * Check and tick the cooldown for a given key.
     * @param {string} key - Format: cName:guildId:userId
     * @returns {number} Remaining cooldown in ms, or 0 if not on cooldown.
     */
    check(key: string): number;
    /**
     * Register a command's cooldown settings.
     * @param {string} cName - Command name.
     * @param {[number, number]} cooldown - [limitPerPeriod, periodInSeconds]
     */
    addCommand(cName: string, cooldown: [number, number]): void;
    /**
     * Start the sweeper to clean up expired cooldowns.
     */
    startSweeper(): void;
    /**
     * Stop the sweeper.
     */
    stopSweeper(): void;
}
