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
    /**
     * Creates a new object in the store.
     * @param {T} data - The object to create, must have an 'id' property.
     * @returns {Promise<T>} The created object.
     */
    async create(data) {
        if (!data.id) {
            throw new Error("Object must have an 'id' property.");
        }
        this.store.set(data.id, data);
        return data;
    }
    /**
     * Queries the store for objects matching the provided query.
     * @param {Partial<T>} query - The query to filter objects by.
     * @returns {Promise<T[]>} An array of objects matching the query.
     */
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
    /**
     * Fetches a single object from the store by its id.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @returns {Promise<T | null>} The object if found, otherwise null.
     */
    async fetchOne(query) {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        return this.store.get(query.id) || null;
    }
    /**
     * Fetches all objects from the store.
     * @returns {Promise<T[]>} An array of all objects in the store.
     */
    async fetchAll() {
        return Array.from(this.store.values());
    }
    /**
     * Fetches an object by its id or creates a new one if it doesn't exist.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @param {T} data - The data to create the object with if it doesn't exist.
     * @returns {Promise<T>} The found or created object.
     */
    async fetchOneOrCreate(query, data) {
        const result = await this.fetchOne(query);
        if (result !== null)
            return result;
        return this.create(data);
    }
    /**
     * Updates an object in the store.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @param {T} data - The data to update the object with.
     * @returns {Promise<T | null>} The updated object if found, otherwise null.
     */
    async update(query, data) {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        if (!this.store.has(query.id))
            return null;
        this.store.set(query.id, { ...this.store.get(query.id), ...data });
        return this.store.get(query.id);
    }
    /**
     * Deletes an object from the store by its id.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @returns {Promise<boolean>} True if the object was deleted, otherwise false.
     */
    async delete(query) {
        return this.store.delete(query.id);
    }
}
