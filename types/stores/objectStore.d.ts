import { Store, StoreTypes } from "./store.js";
export type ObjectWithId = {
    id: string;
    [key: string | number | symbol]: any;
};
/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export declare class ObjectStore<T extends ObjectWithId = ObjectWithId> implements Store<T> {
    name: string;
    private store;
    readonly type = StoreTypes.ObjectStore;
    constructor(name: string);
    create(data: T): Promise<T>;
    query(query: Partial<T>): Promise<T[]>;
    fetchOne(query: Partial<T>): Promise<T | null>;
    fetchAll(): Promise<T[]>;
    fetchOneOrCreate(query: Partial<T>, data: T): Promise<T>;
    update(query: Partial<T>, data: T): Promise<T | null>;
    delete(query: Partial<T>): Promise<boolean>;
}
