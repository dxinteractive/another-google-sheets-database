// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "src/**/*.js",
        "*.js",
        "!jest.config.js"
    ],
    testMatch: ["**/__tests__/**/*-test.js"],
    testURL: 'http://localhost',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};
