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
    constructor({ name, model, }: {
        name: string;
        model: mongoose.Model<any, any, any, any, any, any>;
    }, defaults?: any);
    /**
     * Set the Mongoose model for this store.
     * @param {mongoose.Model} value
     */
    set model(value: mongoose.Model<any, any, any, any, any, any>);
    /**
     * Get the Mongoose model for this store.
     * @returns {mongoose.Model}
     */
    get model(): mongoose.Model<any, any, any, any, any, any>;
    defaults: any;
    _model: mongoose.Model<any, any, any, any, any, any>;
}
import { Store } from "./store.js";
import mongoose from "mongoose";
