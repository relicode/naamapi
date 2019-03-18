import { contentful as contentfulConfig } from '@utils/config'
import Logger from '@utils/logger'
import { Entry, EntryCollection, createClient } from 'contentful'
import createError from 'http-errors'

import middyfy from '../utils/middy'
import { Omit } from '../utils/types'

const { log } = new Logger('services/contentful')

interface MainInfoPageFields {
  content: string,
  headerImage: any
  order: number,
  title: string,
}

type TrimmedMainInfoPageFields = Omit<MainInfoPageFields, 'headerImage'>

interface RecordFields {
  createdAt: string,
  headerImage: string,
  updatedAt: string,
}

interface TrimmedMainInfoPageEntry extends TrimmedMainInfoPageFields, RecordFields {
  headerImage: string,
}

export const client = createClient(contentfulConfig)

const trimMainInfoPageEntry = (entry: Entry<MainInfoPageFields>): TrimmedMainInfoPageEntry => {
  const { createdAt, updatedAt } = entry.sys
  const { headerImage, title, content, order } = entry.fields

  return {
    content,
    createdAt,
    headerImage: headerImage.fields.file,
    order,
    title,
    updatedAt,
  }
}

export const fetchMainInfoPages = async (): Promise<TrimmedMainInfoPageEntry[]> => {
  const entries = await client.getEntries({ content_type: 'mainInfoPage' }) as EntryCollection<MainInfoPageFields>
  const records = entries.items.map((entry) => trimMainInfoPageEntry(entry))
  return records
}
