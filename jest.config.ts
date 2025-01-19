// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest", // Use ts-jest for TypeScript support
	testEnvironment: "jest-environment-jsdom", // Ensure jsdom is set for DOM-related tests
	transform: {
		"^.+\\.[t|j]sx?$": "ts-jest", // Transform TypeScript and JSX files using ts-jest
	},
	setupFilesAfterEnv: [
		"@testing-library/jest-dom", // Ensure @testing-library/jest-dom is loaded
	],
	moduleFileExtensions: ["js", "ts", "jsx", "tsx", "json", "node"], // Extensions Jest will process
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json", // Specify the tsconfig file if needed
			diagnostics: false, // Optionally disable TypeScript diagnostics
		},
	},
	transformIgnorePatterns: [
		"node_modules/(?!(@testing-library|react-router-dom)/)", // Allow transformation for certain packages
	],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
	},
	testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore node_modules and dist folders
};

export default config;
