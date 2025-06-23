import { Store, StoreTypes } from "./store.js";

export type ObjectWithId = {
    id: string;
    [key: string]: any;
}

/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export class ObjectStore extends Store<ObjectWithId> {
    private store: Map<string, ObjectWithId> = new Map();
    readonly type = StoreTypes.ObjectStore;
    constructor(name: string) {
        super(name);
    }

    async create(data: ObjectWithId): Promise<ObjectWithId> {
        if (!data.id) {
            throw new Error("Object must have an 'id' property.");
        }
        this.store.set(data.id, data);
        return data;
    }

    async query(query: Partial<ObjectWithId>): Promise<ObjectWithId[]> {
        const results: ObjectWithId[] = [];
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

    async fetchOne(query: ObjectWithId): Promise<ObjectWithId | null> {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        return this.store.get(query.id) || null;
    }
    
    async fetchAll(): Promise<ObjectWithId[]> {
        return Array.from(this.store.values());
    }
    
    async update(query: ObjectWithId, data: ObjectWithId): Promise<ObjectWithId | null> {
        if (!query.id)
            throw new Error("Query must have an 'id' property.");
        
        if (!this.store.has(query.id)) return null;
        this.store.set(query.id, { ...this.store.get(query.id), ...data });
        return this.store.get(query.id);
    }

    async delete(query: ObjectWithId): Promise<boolean> {
        return this.store.delete(query.id);
    }
    
}