import { Store } from "./store.js";

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
    constructor({ name, defaults = {} } = {}) {
        super({ name });
        this._store = new Map();
        this.defaults = defaults;
    }

    /**
     * Find one document by query.
     * Only supports simple key-value queries (e.g., { _id: "userId" }).
     * @param {Object} query - Query object.
     * @returns {Promise<any|undefined>} The found document or undefined.
     */
    async findOne(query) {
        // Only supports simple key-value queries (e.g., { _id: "userId" })
        const key = query._id ?? query.id;
        if (key === undefined) return undefined;
        return this._store.get(key);
    }

    /**
     * Create a new document in the store.
     * @param {Object} data - Data to create. Must have an _id or id property.
     * @returns {Promise<any>} The created document.
     * @throws {Error} If data does not have an _id or id property.
     */
    async create(data) {
        const key = data._id ?? data.id;
        if (key === undefined) throw new Error("Data must have an _id or id property");
        this._store.set(key, { ...this.defaults, ...data });
        return this._store.get(key);
    }

    /**
     * Update a document in the store.
     * @param {Object} query - Query object. Must have an _id or id property.
     * @param {Object} update - Update data.
     * @returns {Promise<any>} The updated document.
     * @throws {Error} If query does not have an _id or id property.
     */
    async update(query, update) {
        const key = query._id ?? query.id;
        if (key === undefined) throw new Error("Query must have an _id or id property");
        const existing = this._store.get(key) || {};
        const updated = { ...existing, ...update };
        this._store.set(key, updated);
        return updated;
    }

    /**
     * Delete a document from the store.
     * @param {Object} query - Query object. Must have an _id or id property.
     * @returns {Promise<boolean>} True if deleted, false otherwise.
     * @throws {Error} If query does not have an _id or id property.
     */
    async delete(query) {
        const key = query._id ?? query.id;
        if (key === undefined) throw new Error("Query must have an _id or id property");
        return this._store.delete(key);
    }

    /**
     * Get a document or create it if it does not exist.
     * @param {Object} query - Query object.
     * @param {Object} [extraDefaults={}] - Additional default values if creating.
     * @returns {Promise<any>} The found or created document.
     */
    async getOrCreate(query, extraDefaults = {}) {
        let doc = await this.findOne(query);
        if (!doc) {
            doc = await this.create({ ...query, ...extraDefaults });
        }
        return doc;
    }
}