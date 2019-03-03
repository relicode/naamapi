module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@services/(.*)": "<rootDir>/src/services/$1",
    "^@utils/(.*)": "<rootDir>/src/utils/$1",
  },
}
