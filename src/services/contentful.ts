import { contentful as contentfulConfig } from '@utils/config'
import Logger from '@utils/logger'
import { createClient } from 'contentful'
import { Entry, Field } from 'contentful'
import createError from 'http-errors'

const { log } = new Logger('services/contentful')

interface MainPageFields {
  content: string,
  headerImage: any
  order: number,
  title: string,
}

interface TrimmedMainPage extends MainPageFields {
  createdAt: string,
  headerImageUrl: string,
  updatedAt: string,
}

interface MainPageIdMap {
  kiltis: string,
}

const mainPageIdMap: MainPageIdMap = {
  kiltis: '741pLXPdPs4LvlulI3xOck',
}

export const contentfulClient = createClient(contentfulConfig)

const trimMainPage = (entry: Entry<MainPageFields>): TrimmedMainPage => {
  const { createdAt, updatedAt } = entry.sys
  const { headerImage, title, content, order } = entry.fields
  const headerImageUrl: string = headerImage.fields.file

  return {
    content,
    createdAt,
    headerImage,
    headerImageUrl,
    order,
    title,
    updatedAt,
  }
}

export const fetchMainPage = async <T extends keyof MainPageIdMap>(pageName: T): Promise<TrimmedMainPage> => {
  if (!mainPageIdMap.hasOwnProperty(pageName)) {
    throw new createError.NotFound()
  }

  const entry: Entry<MainPageFields> = await contentfulClient.getEntry(mainPageIdMap[pageName])
  log(`Successfully fetched page: ${entry.fields.title}`)
  const trimmedEntry = trimMainPage(entry)
  return trimmedEntry
}
