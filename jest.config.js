module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/backend/functions/'],
  testMatch: ['**/*.test.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
