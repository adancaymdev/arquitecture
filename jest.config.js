/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
    moduleNameMapper: {
        "^@application/(.*)$": "<rootDir>/src/application/$1",
        "^@domain/(.*)$": "<rootDir>/src/domain/$1",
        "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
        "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
    },
    testMatch: ["**/__tests__/**/*.spec.ts", "**/?(*.)+(spec|test).ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        "<rootDir>/src/test/",
        "\\.test\\.ts$",
    ],
    coverageReporters: ["text", "lcov"]
};