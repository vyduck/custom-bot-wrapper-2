import { FilterQuery, Model } from "mongoose";
import { Store, StoreTypes } from "./store.js";

/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore<T extends object = any> implements Store<T> {
    name: string;
    private model: Model<T>;
    readonly type = StoreTypes.MongoStore;
    constructor(name: string, model: Model<T>) {
        this.name = name;
        this.model = model;
    }
    
    /**
     * Creates a new document in the MongoDB collection.
     * @param {Partial<T>} data - The data to create the document with.
     * @returns {T} The created document.
     */
    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    /**
     * Queries the MongoDB collection with the provided filter.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T[]} An array of documents matching the query.
     */
    async query(query: FilterQuery<T>): Promise<T[]> {
        return await this.model.find(query).exec();
    }
    
    /**
     * Fetches a single document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T | null} The document if found, otherwise null.
     */
    async fetchOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    /**
     * Fetches all documents from the MongoDB collection.
     * @returns {T[]} An array of all documents in the collection.
     */
    async fetchAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    /**
     * Fetches a document or creates a new one if it doesn't exist.
     * @param {Partial<T>} query - The filter to apply to the query.
     * @param {Partial<T>} data - The data to create the document with if it doesn't exist.
     * @returns {T} The found or created document.
     */
    async fetchOneOrCreate(query: Partial<T>, data: Partial<T>): Promise<T> {
        const result = await this.fetchOne(query);
        if (result !== null)
            return result;
        return await this.create(data);
    }

    /**
     * Updates a document in the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @param {Partial<T>} data - The data to update the document with.
     * @returns {T | null} The updated document if found, otherwise null.
     */
    async update(query: FilterQuery<T>, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }

    /**
     * Deletes a document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {boolean} True if a document was deleted, otherwise false.
     */
    async delete(query: FilterQuery<T>): Promise<boolean>{
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }    
}