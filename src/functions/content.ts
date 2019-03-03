import { APIGatewayProxyHandler } from 'aws-lambda'
import { fetchMainPage } from '@services/contentful'
import { createErrorResponse } from '@utils/lambda'
import Logger from '@utils/logger'
import { middify } from '@utils/middy'

const { log } = new Logger('mainPage')

const mainPageHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const { pageName } = event.pathParameters
    const page = await fetchMainPage(pageName as any)
    const { fields } = page
    log(`Successfully fetched page: ${fields.title}`)
    return { statusCode: 200, body: JSON.stringify(fields) }
  } catch (e) {
    return createErrorResponse(e)
  }
}

export const mainPage = middify(mainPageHandler)
