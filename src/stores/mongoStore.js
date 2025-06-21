import mongoose from "mongoose";
import { Store } from "./store.js";

export class MongoStore extends Store {
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

    get model() {
        return this._model;
    }

    async findOne(query) {
        return this.model.findOne(query);
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(query, update, options = {}) {
        return this.model.findOneAndUpdate(query, update, { new: true, ...options });
    }

    async delete(query) {
        return this.model.deleteOne(query);
    }

    async getOrCreate(query, extraDefaults = {}) {
        let doc = await this.findOne(query);
        if (!doc) {
            doc = await this.create({ ...this.defaults, ...query, ...extraDefaults });
        }
        return doc;
    }
}