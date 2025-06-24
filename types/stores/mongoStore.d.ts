import { FilterQuery, Model } from "mongoose";
import { Store, StoreTypes } from "./store.js";
/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export declare class MongoStore<T extends object = any> implements Store<T> {
    name: string;
    private model;
    readonly type = StoreTypes.MongoStore;
    constructor(name: string, model: Model<T>);
    /**
     * Creates a new document in the MongoDB collection.
     * @param {Partial<T>} data - The data to create the document with.
     * @returns {T} The created document.
     */
    create(data: Partial<T>): Promise<T>;
    /**
     * Queries the MongoDB collection with the provided filter.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T[]} An array of documents matching the query.
     */
    query(query: FilterQuery<T>): Promise<T[]>;
    /**
     * Fetches a single document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T | null} The document if found, otherwise null.
     */
    fetchOne(query: FilterQuery<T>): Promise<T | null>;
    /**
     * Fetches all documents from the MongoDB collection.
     * @returns {T[]} An array of all documents in the collection.
     */
    fetchAll(): Promise<T[]>;
    /**
     * Fetches a document or creates a new one if it doesn't exist.
     * @param {Partial<T>} query - The filter to apply to the query.
     * @param {Partial<T>} data - The data to create the document with if it doesn't exist.
     * @returns {T} The found or created document.
     */
    fetchOneOrCreate(query: Partial<T>, data: Partial<T>): Promise<T>;
    /**
     * Updates a document in the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @param {Partial<T>} data - The data to update the document with.
     * @returns {T | null} The updated document if found, otherwise null.
     */
    update(query: FilterQuery<T>, data: Partial<T>): Promise<T | null>;
    /**
     * Deletes a document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {boolean} True if a document was deleted, otherwise false.
     */
    delete(query: FilterQuery<T>): Promise<boolean>;
}
