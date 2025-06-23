import { Model } from "mongoose";
import { Store } from "./store.js";
/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export declare class MongoStore<T extends Document = Document> extends Store<T> {
    model: Model<T>;
    constructor(name: string, model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    query(query: Partial<T>): Promise<T[]>;
    fetchOne(query: Partial<T>): Promise<T | null>;
    fetchAll(): Promise<T[]>;
    update(query: Partial<T>, data: Partial<T>): Promise<T | null>;
    delete(query: Partial<T>): Promise<boolean>;
}
