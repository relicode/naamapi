import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  ScheduledEvent,
} from 'aws-lambda'

import { fetchToCache, readFromCache } from '@services/onesignal'
import { createErrorResponse } from '@utils/errors'
import middify from '@utils/middy'

export const scheduleHandler = async (ev: ScheduledEvent): Promise<any> => {
  try {
    const etag = await fetchToCache()
    return { statusCode: 200, body: JSON.stringify({}) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

const handleGet = async (ev: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const since = ev.queryStringParameters.since
    ? parseInt(ev.queryStringParameters.since, 10)
    : undefined

  try {
    const data = await readFromCache(since)
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (e) {
    try {
      if (e.statusCode === 404) {
        await fetchToCache()
        const data = await readFromCache(since)
        return { statusCode: 200, body: JSON.stringify(data) }
      }
      throw e
    } catch (e) {
      return createErrorResponse(e)
    }
  }
}

const apiGatewayHandler: APIGatewayProxyHandler = async (ev) => {
  return await handleGet(ev)
}

export const handler = middify(apiGatewayHandler)
