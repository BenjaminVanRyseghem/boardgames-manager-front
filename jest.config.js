/* eslint-disable filenames/match-regex */
const { defaults } = require("jest-config");

module.exports = {
	automock: false,
	collectCoverage: true,
	collectCoverageFrom: ["**/src/**/*.js"],
	coverageDirectory: "./coverage",
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		}
	},
	snapshotSerializers: ["enzyme-to-json/serializer"],
	testURL: "http://localhost/",
	verbose: true,
	moduleFileExtensions: [...defaults.moduleFileExtensions, "svg"]
};
