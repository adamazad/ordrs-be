const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  testTimeout: 30000,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
  collectCoverage: true,
};
