/**
 * Base Store class for data storage backends.
 * Should be extended by specific store implementations.
 */
export class Store {
    name;
    /**
     * Create a new Store.
     */
    constructor(name) {
        this.name = name;
    }
}
