import mongoose from "mongoose";
import { Store } from "./store.js";

/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore extends Store {
    /**
     * Create a new MongoStore.
     * @param {Object} options
     * @param {string} options.name - Name of the store.
     * @param {mongoose.Model} options.model - Mongoose model to use for storage.
     * @param {Object} [defaults={}] - Default values for new documents.
     */
    constructor({
        name, // Name of the store
        model, // Mongoose model
    }, defaults = {}) {
        super({
            name
        });
        this.model = model;
        this.defaults = defaults;
    }

    /**
     * Set the Mongoose model for this store.
     * @param {mongoose.Model} value
     */
    set model(value) {
        if (
        !value ||
        typeof value !== "function" ||
        typeof value.find !== "function" ||
        typeof value.create !== "function" ||
        typeof value.findOne !== "function"
    ) {
            throw new TypeError("Model must be a valid Mongoose model");
        }
        this._model = value;
    }

    /**
     * Get the Mongoose model for this store.
     * @returns {mongoose.Model}
     */
    get model() {
        return this._model;
    }

    /**
     * Find one document by query.
     * @param {Object} query - Query object.
     * @returns {Promise<any>} The found document.
     */
    async findOne(query) {
        return this.model.findOne(query);
    }

    /**
     * Create a new document in the store.
     * @param {Object} data - Data to create.
     * @returns {Promise<any>} The created document.
     */
    async create(data) {
        return this.model.create(data);
    }

    /**
     * Update a document in the store.
     * @param {Object} query - Query object.
     * @param {Object} update - Update data.
     * @param {Object} [options={}] - Additional options.
     * @returns {Promise<any>} The updated document.
     */
    async update(query, update, options = {}) {
        return this.model.findOneAndUpdate(query, update, { new: true, ...options });
    }

    /**
     * Delete a document from the store.
     * @param {Object} query - Query object.
     * @returns {Promise<any>} The result of the deletion.
     */
    async delete(query) {
        return this.model.deleteOne(query);
    }

    /**
     * Get a document or create it if it does not exist.
     * @param {Object} query - Query object.
     * @param {Object} [extraDefaults={}] - Additional default values if creating.
     * @returns {Promise<any>} The found or created document.
     */
    async getOrCreate(query, extraDefaults = {}) {
        let doc = await this.findOne(query);
        if (!doc) {
            doc = await this.create({ ...this.defaults, ...query, ...extraDefaults });
        }
        return doc;
    }
}