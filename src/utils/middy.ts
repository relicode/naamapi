import * as middlewares from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import middy, { Middy } from 'middy'

const { httpSecurityHeaders, httpErrorHandler, httpEventNormalizer, jsonBodyParser } = require('middy/middlewares')
const { prodStages, stage } = process.env

export const middify = (handler: APIGatewayProxyHandler): Middy<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const middified = middy(handler)
    .use(jsonBodyParser())      // parses the request body when it's a JSON and converts it to an object
    .use(httpErrorHandler())    // handles common http errors and returns proper responses
    .use(httpEventNormalizer()) // makes sure that an object for queryStringParameters and pathParameters is always available
  if (prodStages.includes(stage)) {
    middified.use(httpSecurityHeaders())  // Applies best practice security headers to responses.
  }
  return middified
}
