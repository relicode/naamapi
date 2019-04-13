import { Omit } from '@utils/types'
import { Entry, EntryCollection } from 'contentful'

export const DYNAMIC_CONTENT_TYPES = ['mainInfoPage', 'performer'] as const

export type DynamicContentTypes = typeof DYNAMIC_CONTENT_TYPES[number]
export type DynamicContentFieldTypes = MainInfoPageFields | PerformerFields
export type DynamicContentRecord = MainInfoPageRecord | PerformerRecord

export type DynamicContentEntry = Entry<DynamicContentFieldTypes>
export type DynamicContentEntryCollection = EntryCollection<DynamicContentFieldTypes>

export interface HeaderImage {
  height: number,
  url: string,
  width: number,
}

export interface RecordFields {
  createdAt: string,
  headerImage: HeaderImage,
  updatedAt: string,
}

export interface MainInfoPageFields {
  content: string,
  headerImage: any
  order: number,
  title: string,
}

export interface PerformerFields {
  description: string,
  headerImage: any,
  isStar: boolean,
  name: string,
}

export type MainInfoPageRecord = Omit<MainInfoPageFields, 'headerImage'> & RecordFields
export type PerformerRecord = Omit<PerformerFields, 'headerImage'> & RecordFields

export interface DynamicContentResponse {
  mainInfoPages?: MainInfoPageRecord[],
  performer?: PerformerRecord[],
  synced: string,
}
