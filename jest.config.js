module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__dummy__/dummyFile.js'
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    setupFiles: ['<rootDir>/client/jest.setup.js'],
}