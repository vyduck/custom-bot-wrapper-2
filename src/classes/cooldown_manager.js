import { createCooldown } from "better-cooldown";

export class CooldownManager {
    commands = new Map();
    cooldowns = new Map();

    sweeper = {
        interval: 1000 * 60 * 5, // 5 minutes
        active: false,
        intervalId: null
    }

    constructor(sweeperInterval = 1000 * 60 * 5) {
        if (typeof sweeperInterval !== 'number' || sweeperInterval <= 0) 
            throw new TypeError('Sweeper interval must be a positive number');
        this.sweeper.interval = sweeperInterval;
        this.startSweeper();
    }

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

    addCommand(cName, cooldown) {
        if (typeof cName !== 'string') {
            throw new TypeError('Command name must be a string');
        }
        if (!Array.isArray(cooldown) || cooldown.length !== 2 || typeof cooldown[0] !== 'number' || typeof cooldown[1] !== 'number') {
            throw new TypeError('Cooldown must be an array of the format [limitPerPeriod, periodInSeconds]');
        }
        this.commands.set(cName, cooldown);
    }

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
    
    stopSweeper() {
        if (this.sweeper.intervalId) {
            clearInterval(this.sweeper.intervalId);
            this.sweeper.active = false;
            this.sweeper.intervalId = null;
        }
    }
}