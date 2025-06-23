import { Store, StoreTypes } from "./store.js";
export type ObjectWithId = {
    id: string;
    [key: string]: any;
};
/**
 * In-memory object store for session-wide variables.
 * Extends the base Store class.
 */
export declare class ObjectStore extends Store<ObjectWithId> {
    private store;
    readonly type = StoreTypes.ObjectStore;
    constructor(name: string);
    create(data: ObjectWithId): Promise<ObjectWithId>;
    query(query: Partial<ObjectWithId>): Promise<ObjectWithId[]>;
    fetchOne(query: ObjectWithId): Promise<ObjectWithId | null>;
    fetchAll(): Promise<ObjectWithId[]>;
    update(query: ObjectWithId, data: ObjectWithId): Promise<ObjectWithId | null>;
    delete(query: ObjectWithId): Promise<boolean>;
}
