import { Entry } from 'contentful'

import { getCacheFile } from '@services/cache'
import { client } from '@services/contentful/client'
import Logger from '@utils/logger'

import {
  DYNAMIC_CONTENT_TYPES_PLURAL_MAP,
  DynamicContentEntryCollection,
  DynamicContentRecord,
  DynamicContentResponse,
  DynamicContentTypes,
  MainInfoPageFields,
  MainInfoPageRecord,
  PerformanceFields,
  PerformanceRecord,
  PerformerFields,
  PerformerRecord,
} from './types'

const { error, log } = new Logger('services/contentful')

const replaceImageUrls = (content: string = ''): string => (
  content.replace(/\/\/images\.ctfassets\.net/g, 'https://images.ctfassets.net')
)

const imageToRecordField = (imageEntryField: any) => (
  imageEntryField
  ? {
    url: imageEntryField.fields.file.url,
    width: imageEntryField.fields.file.details.image.width,
    height: imageEntryField.fields.file.details.image.height,
  } : null
)

interface RecordBase {
  createdAt: string,
  updatedAt: string,
  id: string,
}

const getPerformerName = (performerFields: PerformerFields): string => {
  try {
    return performerFields.name
  } catch (e) {
    error('Performer name not found.')
    error(e)
    return 'Mysteeriesiintyjä'
  }
}

const convertEntriesToRecords = (entryCollection: DynamicContentEntryCollection): DynamicContentRecord[] => {
  const { items } = entryCollection

  return items.map((item) => {
    const { createdAt, updatedAt } = item.sys
    const recordBase: RecordBase = { createdAt, updatedAt, id: item.sys.id }
    const { id } = item.sys.contentType.sys

    switch (id as DynamicContentTypes) {

      case 'mainInfoPage':
        const mainInfoPageFields = item.fields as MainInfoPageFields
        return {
          ...recordBase,
          title: mainInfoPageFields.title,
          content: replaceImageUrls(mainInfoPageFields.content),
          order: mainInfoPageFields.order,
          headerImage: imageToRecordField(mainInfoPageFields.headerImage),
        } as MainInfoPageRecord

      case 'performer':
        const performerFields = item.fields as PerformerFields
        return {
          ...recordBase,
          description: replaceImageUrls(performerFields.description),
          headerImage: imageToRecordField(performerFields.headerImage),
          isStar: performerFields.isStar,
          name: getPerformerName(performerFields),
        } as PerformerRecord

      case 'performance':
        const performanceFields = item.fields as PerformanceFields
        const performerNames = performanceFields.performers.map((p: Entry<PerformerFields>) => (
          getPerformerName(p.fields)
        )).join(', ')
        const performerDescriptions = replaceImageUrls(
          performanceFields.performers
            .map((p: Entry<PerformerFields>) => p.fields.description).join('\n'),
        )
        return {
          ...recordBase,
          description: replaceImageUrls(performanceFields.description) + performerDescriptions,
          headerImage: imageToRecordField(performanceFields.headerImage),
          name: performanceFields.name || performerNames,
          startTime: new Date(performanceFields.startTime).toISOString(),
          endTime: new Date(performanceFields.endTime).toISOString(),
          performers: performerNames,
          location: performanceFields.location,
        } as PerformanceRecord

      default:
        throw new Error('Invalid content type: ' + id)
    }
  })
}

const sortPerformancesByTime = (records: PerformanceRecord[]): PerformanceRecord[] => (
  records.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
)

const getRecords = async (contentType: DynamicContentTypes):
  Promise<{ [key: string]: DynamicContentRecord[] }> => {
    log(`Getting entries for ${contentType}`)

    try {
      const entryCollection = await client.getEntries({
        content_type: contentType,
      }) as DynamicContentEntryCollection
      return { [DYNAMIC_CONTENT_TYPES_PLURAL_MAP[contentType]]: convertEntriesToRecords(entryCollection) }
    } catch (e) {
      error(`Error fetching ${contentType}`)
      error(e)
    }
}

export const fetchDynamicContent = async (contentTypes: DynamicContentTypes[]): Promise<DynamicContentResponse> => {
  const values = await Promise.all([
    ...contentTypes.map((contentType) => getRecords(contentType)),
  ])

  // This is weakness in TypeScript's Promise.all
  // https://stackoverflow.com/questions/33684634/how-to-use-promise-all-with-typescript
  const cacheFile = await getCacheFile()

  log(`Successfully fetched ${contentTypes.join(', ')}`)

  const keyValues = values.reduce((acc, cur) => ({ ...acc, ...cur }))
  keyValues.performances = sortPerformancesByTime(keyValues.performances as PerformanceRecord[])

  return { ...{ ...keyValues }, synced: cacheFile.time }
}
