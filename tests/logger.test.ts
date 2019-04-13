import Logger from '@utils/logger'

const logger = new Logger('test-logger')
const { error, info, log, warn } = logger

const THE_MESSAGE = 'THE MESSAGE'

class Circular {
  public circular = this
  public message = THE_MESSAGE
}

const defaultMessage = { message: THE_MESSAGE }
const circularMessage = new Circular()

test('Logger instanciated properly', () => {
  expect(logger).toBeInstanceOf(Logger)
})

test('Logger logs logs, errors, warnings and infos correctly', () => {
  expect(error(defaultMessage)).toEqual(`test-logger - error: { message: 'THE MESSAGE' }`)
  expect(info(defaultMessage)).toEqual(`test-logger - info: { message: 'THE MESSAGE' }`)
  expect(log(defaultMessage)).toEqual(`test-logger - log: { message: 'THE MESSAGE' }`)
  expect(warn(defaultMessage)).toEqual(`test-logger - warn: { message: 'THE MESSAGE' }`)
})

test('Logger handles circular objects', () => {
  expect(log(circularMessage)).toEqual(`test-logger - log: Circular { circular: [Circular], message: 'THE MESSAGE' }`)
})

test('Logger handles strings', () => {
  expect(log(THE_MESSAGE)).toEqual(`test-logger - log: THE MESSAGE`)
})
