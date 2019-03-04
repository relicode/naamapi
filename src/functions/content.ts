import { APIGatewayProxyHandler } from 'aws-lambda'
import { fetchMainPage } from '@services/contentful'
import { createErrorResponse } from '@utils/lambda'
import { middify } from '@utils/middy'

const mainPageHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const { pageName } = event.pathParameters
    const page = await fetchMainPage(pageName as any)
    return { statusCode: 200, body: JSON.stringify(page) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const mainPage = middify(mainPageHandler)
