/**
 * Base Store class for data storage backends.
 * Should be extended by specific store implementations.
 */
export abstract class Store<T extends object = object> {
    name: string;
    readonly type: StoreTypes = StoreTypes.Store

    /**
     * Create a new Store.
     */
    constructor(name: string) {
        this.name = name;
    }

    abstract create(data: Partial<T>): Promise<T>;

    abstract query(query: Partial<T>): Promise<T[]>;
    abstract fetchOne(query: Partial<T>): Promise<T | null>;
    abstract fetchAll(): Promise<T[]>;

    abstract update(query: Partial<T>, data: Partial<T>): Promise<T | null>;

    abstract delete(query: Partial<T>): Promise<boolean>;
}

export enum StoreTypes {
    Store = 0,
    MongoStore = 1,
    ObjectStore = 2,
}