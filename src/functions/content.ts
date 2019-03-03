import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import contentful from 'contentful'
import createError from 'http-errors'
import { contentfulClient } from '@utils/contentful'
import Logger from '@utils/logger'
import { middify } from '@utils/middy'

const { log } = new Logger('handler')

const kiltisHandler: APIGatewayProxyHandler = async (event, context) => {
  const content = await contentfulClient.getEntry('741pLXPdPs4LvlulI3xOck')
  log(content)
  return { statusCode: 200, body: JSON.stringify(content) }
}

export const kiltis = middify(kiltisHandler)
