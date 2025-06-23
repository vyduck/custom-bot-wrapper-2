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
    async fetchOneOrCreate(query, data) {
        const result = await this.fetchOne(query);
        if (result !== null)
            return result;
        return await this.create(data);
    }
    async update(query, data) {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }
    async delete(query) {
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }
}
