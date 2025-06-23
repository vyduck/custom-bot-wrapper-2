import { Store, StoreTypes } from "./store.js";

export type ObjectWithId = {
    id: string;
    [key: string | number | symbol]: any;
};

/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export class ObjectStore<T extends ObjectWithId = any> implements Store<T> {
    name: string;
    private store: Map<string, T> = new Map();
    readonly type = StoreTypes.ObjectStore;
    constructor(name: string) {
        this.name = name;
    }

    async create(data: T): Promise<T> {
        if (!data.id) {
            throw new Error("Object must have an 'id' property.");
        }
        this.store.set(data.id, data);
        return data;
    }

    async query(query: Partial<T>): Promise<T[]> {
        const results: T[] = [];
        for (const obj of this.store.values()) {
            let match = true;
            for (const key in query) {
                if (obj[key] === query[key]) continue;
                match = false;
                break;
            }
            if (match) results.push(obj);
        }
        return results;
    }

    async fetchOne(query: Partial<T>): Promise<T | null> {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        return this.store.get(query.id) || null;
    }
    
    async fetchAll(): Promise<T[]> {
        return Array.from(this.store.values());
    }

    async fetchOneOrCreate(query: Partial<T>, data: T): Promise<T> {
        const result = this.fetchOne(query);
        if (result !== null)
            return result;
        return this.create(data);
    }
    
    async update(query: Partial<T>, data: T): Promise<T | null> {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        
        if (!this.store.has(query.id)) return null;
        this.store.set(query.id, { ...this.store.get(query.id), ...data });
        return this.store.get(query.id);
    }

    async delete(query: Partial<T>): Promise<boolean> {
        return this.store.delete(query.id);
    }
    
}