/**
 * Base Store class for data storage backends.
 * Should be extended by specific store implementations.
 */
export class Store {
    /**
     * Create a new Store.
     * @param {Object} options - Store options.
     * @param {string} options.name - Name of the store.
     */
    constructor({ name }: {
        name: string;
    });
    /** @type {string} */
    name: string;
    _name: string;
    /**
     * Find one document by query.
     * Should be implemented by subclasses.
     * @param {Object} query - Query object.
     * @returns {Promise<any>}
     * @throws {Error} If not implemented.
     */
    findOne(query: any): Promise<any>;
    /**
     * Create a new document.
     * Should be implemented by subclasses.
     * @param {Object} data - Data to create.
     * @returns {Promise<any>}
     * @throws {Error} If not implemented.
     */
    create(data: any): Promise<any>;
    /**
     * Update a document.
     * Should be implemented by subclasses.
     * @param {Object} query - Query object.
     * @param {Object} update - Update data.
     * @param {Object} [options={}] - Additional options.
     * @returns {Promise<any>}
     * @throws {Error} If not implemented.
     */
    update(query: any, update: any, options?: any): Promise<any>;
    /**
     * Delete a document.
     * Should be implemented by subclasses.
     * @param {Object} query - Query object.
     * @returns {Promise<any>}
     * @throws {Error} If not implemented.
     */
    delete(query: any): Promise<any>;
    /**
     * Get or create a document.
     * Should be implemented by subclasses.
     * @param {Object} query - Query object.
     * @param {Object} [defaults={}] - Default values if not found.
     * @returns {Promise<any>}
     * @throws {Error} If not implemented.
     */
    getOrCreate(query: any, defaults?: any): Promise<any>;
}
