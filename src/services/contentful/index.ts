import { contentfulClient as client } from '@utils/contentful'
import Logger from '@utils/logger'
import { Entry, EntryCollection } from 'contentful'

import { MainInfoPageFields, TrimmedMainInfoPageEntry } from './types'

const { log } = new Logger('services/contentful')

const entriesToRecords = (entry: Entry<MainInfoPageFields>): TrimmedMainInfoPageEntry => {
  const { createdAt, updatedAt } = entry.sys
  const { headerImage, title, content, order } = entry.fields

  return {
    content,
    createdAt,
    headerImage: headerImage.fields.file .url,
    order,
    title,
    updatedAt,
  }
}

export const fetchMainInfoPages = async (): Promise<TrimmedMainInfoPageEntry[]> => {
  const entries = await client.getEntries(
    { content_type: 'mainInfoPage', order: 'fields.order' },
  ) as EntryCollection<MainInfoPageFields>

  const records = entries.items.map((entry) => entriesToRecords(entry))
  log('Successfully fetched MainInfoPages')
  return records
}
