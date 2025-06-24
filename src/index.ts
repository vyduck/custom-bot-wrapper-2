import { Bot ,CommandHandler, EventHandler, HookHandler, Logger } from './classes/index.js';
import { MongoStore, ObjectStore, Store } from './stores/index.js'; 

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
    Store,
    Logger
};

/**
 * Default export is the Bot class.
 * @default
 */
export default Bot;