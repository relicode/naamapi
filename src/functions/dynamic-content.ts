import { fetchDynamicContent } from '@services/contentful'
import { DynamicContentTypes } from '@services/contentful/types'
import { DYNAMIC_CONTENT_TYPES } from '@services/contentful/types'
import { createErrorResponse } from '@utils/errors'
import middify from '@utils/middy'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamicContentHandler: APIGatewayProxyHandler = async (ev) => {
  try {
    const contentTypes = (
      typeof ev.pathParameters.contentTypes === 'string'
      ? ev.pathParameters.contentTypes.split('%2C')
      : DYNAMIC_CONTENT_TYPES
    )
    const page = await fetchDynamicContent(contentTypes as DynamicContentTypes[])
    return { statusCode: 200, body: JSON.stringify(page) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const handler = middify(dynamicContentHandler)
