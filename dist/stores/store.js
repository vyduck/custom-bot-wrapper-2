/**
 * Base Store class for data storage backends.
 * Should be extended by specific store implementations.
 */
export class Store {
    name;
    type = StoreTypes.Store;
    /**
     * Create a new Store.
     */
    constructor(name) {
        this.name = name;
    }
}
export var StoreTypes;
(function (StoreTypes) {
    StoreTypes[StoreTypes["Store"] = 0] = "Store";
    StoreTypes[StoreTypes["MongoStore"] = 1] = "MongoStore";
    StoreTypes[StoreTypes["ObjectStore"] = 2] = "ObjectStore";
})(StoreTypes || (StoreTypes = {}));
