import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import middy, { Middy } from 'middy'

// Require used because of bug in package exports
// tslint:disable-next-line
const { httpSecurityHeaders, httpEventNormalizer, jsonBodyParser } = require('middy/middlewares')
const { stage } = process.env

export const middify = (handler: APIGatewayProxyHandler): Middy<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const middified = middy(handler)
    .use(jsonBodyParser())      // parses the request body when it's a JSON and converts it to an object
    .use(httpEventNormalizer()) // makes queryStringParameters and pathParameters always available
  if (['staging', 'production'].includes(stage)) {
    middified.use(httpSecurityHeaders())  // Applies best practice security headers to responses.
  }
  return middified
}
