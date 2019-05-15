import { APIGatewayProxyHandler } from 'aws-lambda'

import { createErrorResponse } from '@utils/errors'
import middify from '@utils/middy'

const { STAGE } = process.env

const sandboxHandler: APIGatewayProxyHandler = async (ev) => {
  if (STAGE !== 'dev') {
    return { statusCode: 403, body: JSON.stringify({ message: 'invalid statge' }) }
  }

  try {
    return { statusCode: 200, body: JSON.stringify({ message: 'sanbox response' }) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const handler = middify(sandboxHandler)
