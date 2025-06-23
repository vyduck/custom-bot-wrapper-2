import { Store, StoreTypes } from "./store.js";
/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore extends Store {
    model;
    type = StoreTypes.MongoStore;
    constructor(name, model) {
        super(name);
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async query(query) {
        return await this.model.find(query).exec();
    }
    async fetchOne(query) {
        return await this.model.findOne(query).exec();
    }
    async fetchAll() {
        return await this.model.find().exec();
    }
    async update(query, data) {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }
    async delete(query) {
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }
}
