/**
 * Base Store class for data storage backends.
 * Should be extended by specific store implementations.
 */
export declare abstract class Store<T extends object = object> {
    name: string;
    readonly type: StoreTypes;
    /**
     * Create a new Store.
     */
    constructor(name: string);
    abstract create(data: Partial<T>): Promise<T>;
    abstract query(query: Partial<T>): Promise<T[]>;
    abstract fetchOne(query: Partial<T>): Promise<T | null>;
    abstract fetchAll(): Promise<T[]>;
    abstract update(query: Partial<T>, data: Partial<T>): Promise<T | null>;
    abstract delete(query: Partial<T>): Promise<boolean>;
}
export declare enum StoreTypes {
    Store = 0,
    MongoStore = 1,
    ObjectStore = 2
}
