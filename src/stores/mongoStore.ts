import { FilterQuery, Model } from "mongoose";
import { Store, StoreTypes } from "./store.js";

/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore<T extends object = {}> implements Store<T> {
    name: string;
    model: Model<T>;
    readonly type = StoreTypes.MongoStore;
    constructor(name: string, model: Model<T>) {
        this.name = name;
        this.model = model;
    }
    
    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async query(query: FilterQuery<T>): Promise<T[]> {
        return await this.model.find(query).exec();
    }
    
    async fetchOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    async fetchAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async fetchOneOrCreate(query: Partial<T>, data: Partial<T>): Promise<T> {
        const result = this.fetchOne(query);
        if (result !== null)
            return result;
        return this.create(data);
    }

    async update(query: FilterQuery<T>, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }

    async delete(query: FilterQuery<T>): Promise<boolean>{
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }    
}