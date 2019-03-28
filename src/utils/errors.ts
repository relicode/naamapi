import {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda'

interface LambdaError {
  message: string,
  statusCode: number,
}

export const createErrorResponse = (error: LambdaError): APIGatewayProxyResult => ({
  body: JSON.stringify({ message: error.message }),
  statusCode: error.statusCode,
})

export function errorWrapper(handler: APIGatewayProxyHandler) {
  return function(...args: [APIGatewayEvent, Context?, Callback<APIGatewayProxyCallback>?]): APIGatewayProxyResult {
    try {
      handler.call(this, args)
    } catch (e) {
      if (e.constructor.super_ && e.constructor.super_.name === 'HttpError') {
        return createErrorResponse(e)
      }
      return createErrorResponse({
        statusCode: 500,
        message: e.message,
      })
    }
  }
}

/*
export const errorWrapper = (
  handler: APIGatewayProxyHandler,
  ...rest: [APIGatewayEvent, Context?, Callback<APIGatewayProxyCallback>?]
): APIGatewayProxyResult => {
  try {
    return handler.call(...rest)
  } catch (e) {
    if (e.constructor.super_ && e.constructor.super_.name === 'HttpError') {
      return createErrorResponse(e)
    }
    return createErrorResponse({
      statusCode: 500,
      message: e.message,
    })
  }
}
*/
