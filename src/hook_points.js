/**
 * List of available hook points for the bot framework.
 * Each property represents a lifecycle event where hooks can be triggered.
 *
 * @typedef {Object} HookPoints
 * @property {string} preEvent - Before an event is handled.
 * @property {string} postEvent - After an event is handled.
 * @property {string} preCommand - Before a command is executed.
 * @property {string} postCommand - After a command is executed.
 * @property {string} preMessage - Before a message is processed.
 * @property {string} postMessage - After a message is processed.
 * @property {string} preReaction - Before a reaction is processed.
 * @property {string} postReaction - After a reaction is processed.
 * @property {string} preInteraction - Before an interaction is processed.
 * @property {string} postInteraction - After an interaction is processed.
 */

/**
 * Exported hook points for use in the bot framework.
 * @type {HookPoints}
 */
export default {
    preEvent: 'pre-event',
    postEvent: 'post-event',
    preCommand: 'pre-command',
    postCommand: 'post-command',
    preMessage: 'pre-message',
    postMessage: 'post-message',
    preReaction: 'pre-reaction',
    postReaction: 'post-reaction',
    preInteraction: 'pre-interaction',
    postInteraction: 'post-interaction'
}