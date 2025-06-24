export interface Store<T extends object = any> {
    name: string;
    readonly type: StoreTypes;
    create(data: Partial<T>): Promise<T>;
    query(query: Partial<T>): Promise<T[]>;
    fetchOne(query: Partial<T>): Promise<T | null>;
    fetchAll(): Promise<T[]>;
    fetchOneOrCreate(query: Partial<T>, data: Partial<T>): Promise<T>;
    update(query: Partial<T>, data: Partial<T>): Promise<T | null>;
    delete(query: Partial<T>): Promise<boolean>;
}
export declare enum StoreTypes {
    MongoStore = 0,
    ObjectStore = 1
}
