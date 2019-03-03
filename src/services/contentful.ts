import { createClient } from 'contentful'
import { Entry } from 'contentful'
import createError from 'http-errors'
import config from '@utils/config'

interface MainPageFields {
  title: string,
  headerImage: any,
  content: string,
}

interface MainPageIdMap {
  kiltis: string,
}

const mainPageIdMap: MainPageIdMap = {
  kiltis: '741pLXPdPs4LvlulI3xOck',
}

export const contentfulClient = createClient(config.contentful)

export const fetchMainPage = <T extends keyof MainPageIdMap>(pageName: T): Promise<Entry<MainPageFields>> => {
  if (!mainPageIdMap.hasOwnProperty(pageName)) {
    throw new createError[404]()
  }
  return contentfulClient.getEntry(mainPageIdMap[pageName])
}
