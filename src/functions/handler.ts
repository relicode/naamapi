import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import Logger from '@utils/logger'
import createError from 'http-errors'
import { middify } from '@utils/middy'

const { log } = new Logger('handler')

const echoHandler: APIGatewayProxyHandler = async (event, context) => {
  const { pathParameters, queryStringParameters } = event
  const { stage } = process.env

  const responseBody = {
    pathParameters,
    queryStringParameters,
    stage,
  }

  log(responseBody, 'eeh', '{}', {})

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  }
}

const errorHandler: APIGatewayProxyHandler = async (event, context) => {
  throw createError(500, 'perkuloos')
  throw new createError.UnprocessableEntity()
  return {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  }
}

export const echo = middify(echoHandler)
export const error = middify(errorHandler)
