import { User } from '../../../domain/entities/User';

describe('User Entity', () => {
    it('should correctly initialize a User instance with provided values', () => {
        const id = '1';
        const name = 'John Doe';
        const email = 'john.doe@example.com';
        const password = 'securepassword';

        const user = new User(id, name, email, password);

        expect(user.id).toBe(id);
        expect(user.name).toBe(name);
        expect(user.email).toBe(email);
        expect(user.password).toBe(password);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
        expect(user.deletedAt).toBeNull();
    });

    it('should set createdAt and updatedAt to the current date', () => {
        const id = '2';
        const name = 'Jane Doe';
        const email = 'jane.doe@example.com';
        const password = 'anothersecurepassword';

        const before = new Date();
        const user = new User(id, name, email, password);
        const after = new Date();

        expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(user.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
});