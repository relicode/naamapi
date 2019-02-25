import Logger from '@utils/logger'

test('Logger instanciated properly', () => {
  expect(new Logger('test-logger')).toBeInstanceOf(Logger)
})
