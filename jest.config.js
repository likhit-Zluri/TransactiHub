// /** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	"coveragePathIgnorePatterns": [
		"<rootDir>/src/modals/AddTransactionModal.tsx"
	],
	setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: {
					jsx: "react-jsx",
				},
			},
		],
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	collectCoverage: true,
};
