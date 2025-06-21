export class Store {
    name; // Name of the store
    /**
     * Base Store class.
     * @param {Object} options - Store options.
     */
    constructor({
        name
    }) {
        this.name = name;
    }

    set name(value) {
        if (typeof value !== "string") {
            throw new TypeError("Store name must be a string");
        }
        this._name = value;
    }

    get name() {
        return this._name;
    }

    /**
     * Find one document by query.
     * Should be implemented by subclasses.
     */
    async findOne(query) {
        throw new Error("findOne() must be implemented by subclass");
    }

    /**
     * Create a new document.
     * Should be implemented by subclasses.
     */
    async create(data) {
        throw new Error("create() must be implemented by subclass");
    }

    /**
     * Update a document.
     * Should be implemented by subclasses.
     */
    async update(query, update, options = {}) {
        throw new Error("update() must be implemented by subclass");
    }

    /**
     * Delete a document.
     * Should be implemented by subclasses.
     */
    async delete(query) {
        throw new Error("delete() must be implemented by subclass");
    }

    /**
     * Get or create a document.
     * Should be implemented by subclasses.
     */
    async getOrCreate(query, defaults = {}) {
        throw new Error("getOrCreate() must be implemented by subclass");
    }
}