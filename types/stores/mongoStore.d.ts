import { FilterQuery, Model } from "mongoose";
import { Store, StoreTypes } from "./store.js";
/**
 * MongoStore class for managing data using a Mongoose model.
 * Extends the base Store class.
 */
export declare class MongoStore<T extends object = {}> implements Store<T> {
    name: string;
    model: Model<T>;
    readonly type = StoreTypes.MongoStore;
    constructor(name: string, model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    query(query: FilterQuery<T>): Promise<T[]>;
    fetchOne(query: FilterQuery<T>): Promise<T | null>;
    fetchAll(): Promise<T[]>;
    fetchOneOrCreate(query: Partial<T>, data: Partial<T>): Promise<T>;
    update(query: FilterQuery<T>, data: Partial<T>): Promise<T | null>;
    delete(query: FilterQuery<T>): Promise<boolean>;
}
