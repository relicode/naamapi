import { fetchMainInfoPages } from '@services/contentful'
import { createErrorResponse } from '@utils/lambda'
import middify from '@utils/middy'
import { APIGatewayProxyHandler } from 'aws-lambda'

const mainPageHandler: APIGatewayProxyHandler = async () => {
  try {
    const page = await fetchMainInfoPages()
    return { statusCode: 200, body: JSON.stringify(page) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const mainInfoPages = middify(mainPageHandler)
