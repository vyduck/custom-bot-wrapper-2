import { createCooldown } from "better-cooldown";

/**
 * Manages cooldowns for commands and users.
 */
export class CooldownManager {
    /** @type {Map<string, [number, number]>} */
    commands = new Map();
    /** @type {Map<string, any>} */
    cooldowns = new Map();

    /**
     * Sweeper configuration for cleaning up expired cooldowns.
     * @type {{ interval: number, active: boolean, intervalId: NodeJS.Timeout | null }}
     */
    sweeper = {
        interval: 1000 * 60 * 5, // 5 minutes
        active: false,
        intervalId: null
    }

    /**
     * Create a new CooldownManager.
     * @param {number} [sweeperInterval=1000*60*5] - Interval in ms for sweeping expired cooldowns.
     */
    constructor(sweeperInterval = 1000 * 60 * 5) {
        if (typeof sweeperInterval !== 'number' || sweeperInterval <= 0) 
            throw new TypeError('Sweeper interval must be a positive number');
        this.sweeper.interval = sweeperInterval;
        this.startSweeper();
    }

    /**
     * Check and tick the cooldown for a given key.
     * @param {string} key - Format: cName:guildId:userId
     * @returns {number} Remaining cooldown in ms, or 0 if not on cooldown.
     */
    check(key) { // key == cName:guildId:userId
        let [cName, guildId, userId] = key.split(':');
        let cooldown = this.cooldowns.get(key);
        if (!cooldown) {
            if (!this.commands.has(cName)) {
                return 0;
            }
            this.cooldowns.set(key, createCooldown(...this.commands.get(cName)));
        }
        return this.cooldowns.get(key).tick();
    }

    /**
     * Register a command's cooldown settings.
     * @param {string} cName - Command name.
     * @param {[number, number]} cooldown - [limitPerPeriod, periodInSeconds]
     */
    addCommand(cName, cooldown) {
        if (typeof cName !== 'string') {
            throw new TypeError('Command name must be a string');
        }
        if (!Array.isArray(cooldown) || cooldown.length !== 2 || typeof cooldown[0] !== 'number' || typeof cooldown[1] !== 'number') {
            throw new TypeError('Cooldown must be an array of the format [limitPerPeriod, periodInSeconds]');
        }
        this.commands.set(cName, cooldown);
    }

    /**
     * Start the sweeper to clean up expired cooldowns.
     */
    startSweeper() {
        if (this.sweeper.active) return;
        this.sweeper.active = true;
        this.sweeper.intervalId = setInterval(() => {
            for (let [key, cooldown] of this.cooldowns.entries()) {
                if (
                    cooldown.strikes.length === 0 ||
                    Date.now() - cooldown.strikes[cooldown.strikes.length - 1] > cooldown.period
                ) this.cooldowns.delete(key);
            }
        }, this.sweeper.interval); 
    }
    
    /**
     * Stop the sweeper.
     */
    stopSweeper() {
        if (this.sweeper.intervalId) {
            clearInterval(this.sweeper.intervalId);
            this.sweeper.active = false;
            this.sweeper.intervalId = null;
        }
    }
}