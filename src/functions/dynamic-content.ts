import { APIGatewayProxyHandler } from 'aws-lambda'

import { fetchDynamicContent } from '@services/contentful'
import { DYNAMIC_CONTENT_TYPES, DynamicContentTypes } from '@services/contentful/types'
import { createErrorResponse } from '@utils/errors'
import middify from '@utils/middy'

const dynamicContentHandler: APIGatewayProxyHandler = async (ev) => {
  try {
    const contentTypes = (
      typeof ev.pathParameters.contentTypes === 'string'
      ? ev.pathParameters.contentTypes.split(',')
      : DYNAMIC_CONTENT_TYPES
    )
    const page = await fetchDynamicContent(contentTypes as DynamicContentTypes[])
    return { statusCode: 200, body: JSON.stringify(page) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const handler = middify(dynamicContentHandler)
