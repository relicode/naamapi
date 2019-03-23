import { getCacheFile } from '@services/cache'
import { contentfulClient as client } from '@utils/contentful'
import Logger from '@utils/logger'
import { Entry, EntryCollection } from 'contentful'

import { MainInfoPageFields, MainInfoPageResponse, TrimmedMainInfoPageEntry } from './types'

const { log } = new Logger('services/contentful')

const entriesToRecords = (entry: Entry<MainInfoPageFields>): TrimmedMainInfoPageEntry => {
  const { createdAt, updatedAt } = entry.sys
  const { headerImage, title, content, order } = entry.fields

  return {
    content: content.replace(/\/\/images\.ctfassets\.net/g, 'https://images.ctfassets.net'),
    createdAt,
    headerImage: {
      url: headerImage.fields.file.url,
      width: headerImage.fields.file.details.image.width,
      height: headerImage.fields.file.details.image.height,
    },
    order,
    title,
    updatedAt,
  }
}

export const fetchMainInfoPages = async (): Promise<MainInfoPageResponse> => {
  const values = await Promise.all([
    client.getEntries(
      { content_type: 'mainInfoPage', order: 'fields.order' },
    ) as Promise<EntryCollection<TrimmedMainInfoPageEntry>>,
    getCacheFile(),
  ])
  log('Successfully fetched MainInfoPages')

  const entries = values[0]
  const synced = values[1].time

  return {
    mainInfoPages: entries.items.map((entry) => entriesToRecords(entry)),
    synced,
  }
}
