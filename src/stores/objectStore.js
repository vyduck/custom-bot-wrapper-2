import { Store } from "./store.js";

/**
 * In-memory object store for session-wide variables.
 */
export class ObjectStore extends Store {
    constructor({ name, defaults = {} } = {}) {
        super({ name });
        this._store = new Map();
        this.defaults = defaults;
    }

    async findOne(query) {
        // Only supports simple key-value queries (e.g., { _id: "userId" })
        const key = query._id ?? query.id;
        if (key === undefined) return undefined;
        return this._store.get(key);
    }

    async create(data) {
        const key = data._id ?? data.id;
        if (key === undefined) throw new Error("Data must have an _id or id property");
        this._store.set(key, { ...this.defaults, ...data });
        return this._store.get(key);
    }

    async update(query, update) {
        const key = query._id ?? query.id;
        if (key === undefined) throw new Error("Query must have an _id or id property");
        const existing = this._store.get(key) || {};
        const updated = { ...existing, ...update };
        this._store.set(key, updated);
        return updated;
    }

    async delete(query) {
        const key = query._id ?? query.id;
        if (key === undefined) throw new Error("Query must have an _id or id property");
        return this._store.delete(key);
    }

    async getOrCreate(query, extraDefaults = {}) {
        let doc = await this.findOne(query);
        if (!doc) {
            doc = await this.create({ ...query, ...extraDefaults });
        }
        return doc;
    }
}