import { fetchDynamicContent } from '@services/contentful'
import { createErrorResponse } from '@utils/errors'
import middify from '@utils/middy'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamicContentHandler: APIGatewayProxyHandler = async (ev) => {
  const { contentType } = ev.pathParameters
  try {
    const page = await fetchDynamicContent(contentType)
    return { statusCode: 200, body: JSON.stringify(page) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const handler = middify(dynamicContentHandler)
