module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['test'],
};
