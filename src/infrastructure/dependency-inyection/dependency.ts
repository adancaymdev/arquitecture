import { container, inject, injectable } from "tsyringe";

/**
 * Dependency injection container.
 *
 * The dependency injection container is a singleton that manages the instances of the application's components.
 * It provides a way to register components and retrieve them with their dependencies resolved.
 *
 * @example
 * // Register a component
 * container.register(Component, { useValue: new Component() });
 *
 * // Retrieve the component with its dependencies resolved
 * const component = container.resolve(Component);
 */
export const Inject = inject;
export const Injectable = injectable;
export const dependency = container;
