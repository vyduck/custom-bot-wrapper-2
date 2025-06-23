import { StoreTypes } from "./store.js";
/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export class ObjectStore {
    name;
    store = new Map();
    type = StoreTypes.ObjectStore;
    constructor(name) {
        this.name = name;
    }
    async create(data) {
        if (!data.id) {
            throw new Error("Object must have an 'id' property.");
        }
        this.store.set(data.id, data);
        return data;
    }
    async query(query) {
        const results = [];
        for (const obj of this.store.values()) {
            let match = true;
            for (const key in query) {
                if (obj[key] === query[key])
                    continue;
                match = false;
                break;
            }
            if (match)
                results.push(obj);
        }
        return results;
    }
    async fetchOne(query) {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        return this.store.get(query.id) || null;
    }
    async fetchAll() {
        return Array.from(this.store.values());
    }
    async fetchOneOrCreate(query, data) {
        const result = this.fetchOne(query);
        if (result !== null)
            return result;
        return this.create(data);
    }
    async update(query, data) {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        if (!this.store.has(query.id))
            return null;
        this.store.set(query.id, { ...this.store.get(query.id), ...data });
        return this.store.get(query.id);
    }
    async delete(query) {
        return this.store.delete(query.id);
    }
}
