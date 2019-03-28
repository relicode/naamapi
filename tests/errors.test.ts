import { errorWrapper } from '@utils/errors'
import createError from 'http-errors'

const ERROR_MESSAGE = 'you are not allowed'
const ERROR_STATUS_CODE = 403

const createErrorHandler = () => {
  throw createError(ERROR_STATUS_CODE, ERROR_MESSAGE)
}

const genericErrorHandler = () => {
  throw new Error(ERROR_MESSAGE)
}

test('errorWrapper catches errors created by http-errors properly', () => {
  const response = errorWrapper(createErrorHandler, {} as any)
  expect(JSON.parse(response.body).message).toEqual(ERROR_MESSAGE)
  expect(response.statusCode).toBe(ERROR_STATUS_CODE)
})

test('errorWrapper catches errors created by "new Error()" properly', () => {
  const response = errorWrapper(genericErrorHandler, {} as any)
  expect(JSON.parse(response.body).message).toEqual(ERROR_MESSAGE)
  expect(response.statusCode).toBe(500)
})
