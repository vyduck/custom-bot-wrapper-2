import { Store, StoreTypes } from "./store.js";
export type ObjectWithId = {
    id: string;
    [key: string | number | symbol]: any;
};
/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export declare class ObjectStore<T extends ObjectWithId = any> implements Store<T> {
    name: string;
    private store;
    readonly type = StoreTypes.ObjectStore;
    constructor(name: string);
    /**
     * Creates a new object in the store.
     * @param {T} data - The object to create, must have an 'id' property.
     * @returns {Promise<T>} The created object.
     */
    create(data: T): Promise<T>;
    /**
     * Queries the store for objects matching the provided query.
     * @param {Partial<T>} query - The query to filter objects by.
     * @returns {Promise<T[]>} An array of objects matching the query.
     */
    query(query: Partial<T>): Promise<T[]>;
    /**
     * Fetches a single object from the store by its id.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @returns {Promise<T | null>} The object if found, otherwise null.
     */
    fetchOne(query: Partial<T>): Promise<T | null>;
    /**
     * Fetches all objects from the store.
     * @returns {Promise<T[]>} An array of all objects in the store.
     */
    fetchAll(): Promise<T[]>;
    /**
     * Fetches an object by its id or creates a new one if it doesn't exist.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @param {T} data - The data to create the object with if it doesn't exist.
     * @returns {Promise<T>} The found or created object.
     */
    fetchOneOrCreate(query: Partial<T>, data: T): Promise<T>;
    /**
     * Updates an object in the store.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @param {T} data - The data to update the object with.
     * @returns {Promise<T | null>} The updated object if found, otherwise null.
     */
    update(query: Partial<T>, data: T): Promise<T | null>;
    /**
     * Deletes an object from the store by its id.
     * @param {Partial<T>} query - The query to filter objects by, must have an 'id' property.
     * @returns {Promise<boolean>} True if the object was deleted, otherwise false.
     */
    delete(query: Partial<T>): Promise<boolean>;
}
