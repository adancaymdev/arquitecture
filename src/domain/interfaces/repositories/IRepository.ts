/**
 * Repository interface for user data access.
 *
 * @remarks
 * This interface defines the methods required for user data access.
 * The methods of this interface must be implemented by any class that wants to provide user data access.
 */
export interface IRepository<T> {
    /**
     * Retrieves a user by its id.
     *
     * @param id - The id of the user to retrieve.
     * @returns A promise that resolves to the user if found, or null if not found.
     */
    findById(id: string): Promise<T>;

    /**
     * Retrieves all users.
     *
     * @returns A promise that resolves to an array of users
     */
    findAll(filter?: Partial<T>): Promise<T[]>;

    /**
     * Retrieves all users that match the specified filter.
     *
     * @param filter - The filter to apply.
     * @returns A promise that resolves to an array of users if found, or null if not found.
     */
    findAllBy(filter: Partial<T>): Promise<T[]>;

    /**
     * Creates a new user.
     *
     * @param user - The user to create.
     * @returns A promise that resolves to the id of the created user.
     */
    create(dto: T): Promise<T>;

    /**
     * Updates an existing user.
     *
     * @param user - The user to update.
     * @returns A promise that resolves when the user is updated.
     */
    update(id : string, dto: Partial<T>): Promise<T>;

    /**
     * Deletes a user by its id.
     *
     * @param id - The id of the user to delete.
     * @returns A promise that resolves when the user is deleted.
     */
    delete(id: string): Promise<void>;
}
