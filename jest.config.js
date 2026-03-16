/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lucide-react$": "<rootDir>/__tests__/__mocks__/lucide-react.ts",
    "^next-auth$": "<rootDir>/__tests__/__mocks__/next-auth.ts",
    "^next-auth/providers/credentials$": "<rootDir>/__tests__/__mocks__/next-auth.ts",
    "^@auth/core$": "<rootDir>/__tests__/__mocks__/next-auth.ts",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transformIgnorePatterns: ["/node_modules/(?!(next-auth|@auth)/)"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/app/**/route.ts",
    "!src/app/**/page.tsx",
    "!src/app/**/layout.tsx",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  testMatch: [
    "<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
