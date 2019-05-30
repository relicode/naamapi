import { S3 } from '@utils/aws'
import Logger from '@utils/logger'

const { CACHE_FILE_NAME, ASSETS_BUCKET } = process.env
const { log, error } = new Logger('utils/cache')

export interface CacheFileContent {
  time: string,
}

export const setCacheFile = async () => {
  const content: CacheFileContent = { time: new Date().toISOString() }
  const body = JSON.stringify(content)
  try {
    const response = await S3.putObject({
      Body: body,
      Bucket: ASSETS_BUCKET,
      ContentType: 'application/json',
      Key: CACHE_FILE_NAME,
    }).promise()
    log('Successfully set cache.')
    return response
  } catch (e) {
    error('Error setting cache.')
    throw e
  }
}

export const getCacheFile = async (): Promise<CacheFileContent> => {
  try {
    const cacheFile = await S3.getObject({
      Bucket: ASSETS_BUCKET,
      Key: CACHE_FILE_NAME,
    }).promise()
    log('Cache get successful.')
    return JSON.parse(cacheFile.Body.toString())
  } catch (e) {
    error('Cache get failed.')
    throw e
  }
}
