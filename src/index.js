import { Bot } from './classes/bot.js';
import { CommandHandler } from './classes/command_handler.js';
import { EventHandler } from './classes/event_handler.js';
import { MongoStore, ObjectStore, Store } from './stores/index.js'; 
import { HookHandler } from './classes/hook_handler.js';

/**
 * Main entry point for the custom-bot-wrapper-2 package.
 * Exports all primary classes for bot creation and extension.
 *
 * @module index
 * @exports Bot
 * @exports CommandHandler
 * @exports EventHandler
 * @exports HookHandler
 * @exports MongoStore
 * @exports ObjectStore
 * @exports Store
 */
export {
    Bot,
    CommandHandler,
    EventHandler,
    HookHandler,
    MongoStore,
    ObjectStore,
    Store
};

/**
 * Default export is the Bot class.
 * @default
 */
export default Bot;