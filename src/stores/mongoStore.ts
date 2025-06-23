import { Model } from "mongoose";
import { Store } from "./store.js";

/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export class MongoStore<T extends Document = Document> extends Store<T> {
    model: Model<T>;
    constructor(name: string, model: Model<T>) {
        super(name);
        this.model = model;
    }
    
    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async query(query: Partial<T>): Promise<T[]> {
        return await this.model.find(query).exec();
    }
    
    async fetchOne(query: Partial<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    async fetchAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async update(query: Partial<T>, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }

    async delete(query: Partial<T>): Promise<boolean>{
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }    
}