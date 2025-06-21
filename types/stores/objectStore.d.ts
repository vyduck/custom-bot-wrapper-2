/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export class ObjectStore extends Store {
    /**
     * Create a new ObjectStore.
     * @param {Object} options
     * @param {string} options.name - Name of the store.
     * @param {Object} [options.defaults={}] - Default values for new entries.
     */
    constructor({ name, defaults }?: {
        name: string;
        defaults?: any;
    });
    _store: Map<any, any>;
    defaults: any;
    /**
     * Update a document in the store.
     * @param {Object} query - Query object. Must have an _id or id property.
     * @param {Object} update - Update data.
     * @returns {Promise<any>} The updated document.
     * @throws {Error} If query does not have an _id or id property.
     */
    update(query: any, update: any): Promise<any>;
    /**
     * Delete a document from the store.
     * @param {Object} query - Query object. Must have an _id or id property.
     * @returns {Promise<boolean>} True if deleted, false otherwise.
     * @throws {Error} If query does not have an _id or id property.
     */
    delete(query: any): Promise<boolean>;
}
import { Store } from "./store.js";
