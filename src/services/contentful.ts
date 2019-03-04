import { createClient } from 'contentful'
import { Entry } from 'contentful'
import createError from 'http-errors'
import { contentful as contentfulConfig } from '@utils/config'
import Logger from '@utils/logger'

const { log } = new Logger('services/contentful')

interface MainPageFields {
  title: string,
  headerImage: any,
  content: string,
}

interface TrimmedMainPage extends MainPageFields {
  headerImage: string,
}

interface MainPageIdMap {
  kiltis: string,
}

const mainPageIdMap: MainPageIdMap = {
  kiltis: '741pLXPdPs4LvlulI3xOck',
}

export const contentfulClient = createClient(contentfulConfig)

const trimMainPage = (entry: Entry<MainPageFields>): TrimmedMainPage => {
  const { headerImage, title, content } = entry.fields
  const { url } = headerImage.fields.file
  return {
    content,
    headerImage: url,
    title,
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
