declare const _default: {
    preEvent: string;
    postEvent: string;
    preCommand: string;
    postCommand: string;
    preMessage: string;
    postMessage: string;
    preReaction: string;
    postReaction: string;
    preInteraction: string;
    postInteraction: string;
};
export default _default;
/**
 * List of available hook points for the bot framework.
 * Each property represents a lifecycle event where hooks can be triggered.
 */
export type HookPoints = {
    /**
     * - Before an event is handled.
     */
    preEvent: string;
    /**
     * - After an event is handled.
     */
    postEvent: string;
    /**
     * - Before a command is executed.
     */
    preCommand: string;
    /**
     * - After a command is executed.
     */
    postCommand: string;
    /**
     * - Before a message is processed.
     */
    preMessage: string;
    /**
     * - After a message is processed.
     */
    postMessage: string;
    /**
     * - Before a reaction is processed.
     */
    preReaction: string;
    /**
     * - After a reaction is processed.
     */
    postReaction: string;
    /**
     * - Before an interaction is processed.
     */
    preInteraction: string;
    /**
     * - After an interaction is processed.
     */
    postInteraction: string;
};
