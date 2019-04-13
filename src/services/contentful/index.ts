import { getCacheFile } from '@services/cache'
import { contentfulClient as client } from '@utils/contentful'
import Logger from '@utils/logger'

import {
  DynamicContentEntryCollection,
  DynamicContentRecord,
  DynamicContentResponse,
  DynamicContentTypes,
  MainInfoPageFields,
  MainInfoPageRecord,
  PerformerFields,
  PerformerRecord,
} from './types'

const { error, log } = new Logger('services/contentful')

const replaceImageUrls = (content: string): string => (
  content.replace(/\/\/images\.ctfassets\.net/g, 'https://images.ctfassets.net')
)

const imageToRecordField = (imageEntryField) => ({
  url: imageEntryField.fields.file.url,
  width: imageEntryField.fields.file.details.image.width,
  height: imageEntryField.fields.file.details.image.height,
})

const convertEntriesToRecords = (entryCollection: DynamicContentEntryCollection): DynamicContentRecord[] => {
  const { items } = entryCollection

  return items.map((item) => {
    const { createdAt, updatedAt } = item.sys
    const recordBase = { createdAt, updatedAt }
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
          name: performerFields.name,
        } as PerformerRecord

      default:
        throw new Error('Invalid content type: ' + id)
    }
  })
}

const getRecords = async (contentType: DynamicContentTypes):
  Promise<{ [key: string]: DynamicContentRecord[] }> => {
    log(`Getting entries for ${contentType}`)

    try {
      const entryCollection = await client.getEntries({
        content_type: contentType,
      }) as DynamicContentEntryCollection
      return { [contentType]: convertEntriesToRecords(entryCollection) }
    } catch (e) {
      error(`Error fetching ${contentType}`)
      error(e)
    }
}

export const fetchDynamicContent = async (contentTypes: DynamicContentTypes[]): Promise<DynamicContentResponse> => {
  const values = await Promise.all([
    ...contentTypes.map((contentType) => getRecords(contentType)),
  ])

  const cacheFile = await getCacheFile()

  log(`Successfully fetched ${contentTypes.join(', ')}`)

  return {
    ...values.splice(0, 2),
    synced: cacheFile.time,
  }
}
