import { StoreTypes } from "./store.js";
/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore {
    name;
    model;
    type = StoreTypes.MongoStore;
    constructor(name, model) {
        this.name = name;
        this.model = model;
    }
    /**
     * Creates a new document in the MongoDB collection.
     * @param {Partial<T>} data - The data to create the document with.
     * @returns {T} The created document.
     */
    async create(data) {
        return await this.model.create(data);
    }
    /**
     * Queries the MongoDB collection with the provided filter.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T[]} An array of documents matching the query.
     */
    async query(query) {
        return await this.model.find(query).exec();
    }
    /**
     * Fetches a single document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {T | null} The document if found, otherwise null.
     */
    async fetchOne(query) {
        return await this.model.findOne(query).exec();
    }
    /**
     * Fetches all documents from the MongoDB collection.
     * @returns {T[]} An array of all documents in the collection.
     */
    async fetchAll() {
        return await this.model.find().exec();
    }
    /**
     * Fetches a document or creates a new one if it doesn't exist.
     * @param {Partial<T>} query - The filter to apply to the query.
     * @param {Partial<T>} data - The data to create the document with if it doesn't exist.
     * @returns {T} The found or created document.
     */
    async fetchOneOrCreate(query, data) {
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
    async update(query, data) {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }
    /**
     * Deletes a document from the MongoDB collection.
     * @param {FilterQuery<T>} query - The filter to apply to the query.
     * @returns {boolean} True if a document was deleted, otherwise false.
     */
    async delete(query) {
        const result = await this.model.deleteMany(query).exec();
        return result.deletedCount > 0;
    }
}
