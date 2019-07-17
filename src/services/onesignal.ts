import axios from 'axios'

import { S3 } from '@utils/aws'
import Logger from '@utils/logger'

const {
  ASSETS_BUCKET,
  ONESIGNAL_APP_ID,
  ONESIGNAL_REST_API_KEY,
  ONESIGNAL_S3_FILENAME,
} = process.env

const { log, error } = new Logger('services/onesignal')

const defaultOptions = {
  params: {
    app_id: ONESIGNAL_APP_ID,
  },
}

const client = axios.create({
  baseURL: 'https://onesignal.com/api/v1',
  headers: {
    Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
  },
})

interface Notification {
  queuedAt: number,
  headerImage: string,
  contents: string,
  headings: string,
}

export const fetchToCache = async () => {
  const { data } = await client.get('/notifications', defaultOptions)
  const { notifications } = data

  const parsedData: Notification[] = notifications.map((n: any) => ({
    queuedAt: n.queued_at,
    headerImage: n.big_picture,
    contents: n.contents.fi || n.contents.en,
    headings: n.headings.fi || n.headings.en,
  }))

  try {
    const response = await S3.putObject({
      Body: JSON.stringify(parsedData),
      Bucket: ASSETS_BUCKET,
      ContentType: 'application/json',
      Key: ONESIGNAL_S3_FILENAME,
    }).promise()
    log('Successfully set onesignal cache.')
    return response
  } catch (e) {
    error('Error setting onesignal cache.')
    throw e
  }
}

export const readFromCache = async (since?: number) => {
  try {
    const cacheFile = await S3.getObject({
      Bucket: ASSETS_BUCKET,
      Key: ONESIGNAL_S3_FILENAME,
    }).promise()
    log('Cache get successful.')
    const parsedData: Notification[] = JSON.parse(cacheFile.Body.toString())
    return parsedData.filter((n) => since ? n.queuedAt > since : true)
  } catch (e) {
    error('Cache get failed.')
    throw e
  }
}
