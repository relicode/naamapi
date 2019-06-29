import { APIGatewayProxyResult } from 'aws-lambda'

interface LambdaError {
  message: string,
  statusCode: number,
}

export const createErrorResponse = (error: LambdaError): APIGatewayProxyResult => ({
  body: JSON.stringify({ message: error.message }),
  statusCode: error.statusCode || 500,
})
