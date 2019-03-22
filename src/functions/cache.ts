import { getCacheFile, setCacheFile } from '@services/cache'
import { createErrorResponse } from '@utils/lambda'
import middify from '@utils/middy'
import { AWSHTTPMethod } from '@utils/types';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

const handlePost = async (): Promise<APIGatewayProxyResult> => {
  try {
    const etag = await setCacheFile()
    return { statusCode: 200, body: JSON.stringify({}) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

const handleGet = async (): Promise<APIGatewayProxyResult> => {
  try {
    const data = await getCacheFile()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (e) {
    try {
      if (e.statusCode === 404) {
        await handlePost()
        const data = await getCacheFile()
        return { statusCode: 200, body: JSON.stringify(data) }
      }
      throw e
    } catch (e) {
      return createErrorResponse(e)
    }
  }
}

const methodHandlernMap = {
  GET: handleGet,
  POST: handlePost,
}

const cacheHandler: APIGatewayProxyHandler = async (ev) => {
  const method = ev.httpMethod as AWSHTTPMethod
  return await methodHandlernMap[method]()
}

export const handler = middify(cacheHandler)
