import type { Config } from "jest";

const config: Config = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    globalSetup: 'jest-preset-angular/global-setup',
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/"
    ],
    "globals": {
        "ts-jest": {
            "tsConfig": "<rootDir>/tsconfig.spec.json",
            "stringifyContentPathRegex": "\\.html$"
        }
    },
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|js|html)$': 'jest-preset-angular'
    },
    moduleNameMapper: {
        '^@Models/(.*)$': '<rootDir>/src/app/models/$1',
        '^@Services/(.*)$': '<rootDir>/src/app/services/$1',
        '^@Ngrx/(.*)$': '<rootDir>/src/app/@ngrx/$1',
        '^@Cache/(.*)$': '<rootDir>/src/app/environment/$1',
    },
};

export default config;