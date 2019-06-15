import { Entry, EntryCollection } from 'contentful'

import { Omit } from '@utils/types'

export const DYNAMIC_CONTENT_TYPES = ['mainInfoPage', 'performer', 'performance'] as const
export const DYNAMIC_CONTENT_TYPES_PLURAL_MAP = {
  mainInfoPage: 'mainInfoScreens',
  performer: 'performers',
  performance: 'performances',
} as { [key in DynamicContentTypes]: string }

export type DynamicContentTypes = typeof DYNAMIC_CONTENT_TYPES[number]
export type DynamicContentFieldTypes = MainInfoPageFields | PerformerFields | PerformanceFields
export type DynamicContentRecord = MainInfoPageRecord | PerformerRecord | PerformanceRecord

export type DynamicContentEntry = Entry<DynamicContentFieldTypes>
export type DynamicContentEntryCollection = EntryCollection<DynamicContentFieldTypes>

export interface HeaderImage {
  height: number,
  url: string,
  width: number,
}

export interface RecordFields {
  createdAt: string,
  headerImage?: HeaderImage,
  updatedAt: string,
}

export interface MainInfoPageFields {
  content: string,
  headerImage?: any
  order: number,
  title: string,
}

export interface PerformerFields {
  description: string,
  headerImage?: any,
  isStar: boolean,
  name: string,
}

export interface PerformanceFields {
  description?: string,
  headerImage?: any,
  name?: string,
  startTime: string,
  endTime: string,
  performers?: any, // Array<Entry<PerformerFields>>,
  location: string,
}

export type MainInfoPageRecord = Omit<MainInfoPageFields, 'headerImage'> & RecordFields
export type PerformerRecord = Omit<PerformerFields, 'headerImage'> & RecordFields
export type PerformanceRecord = Omit<PerformanceFields, 'headerImage'> & RecordFields

export interface DynamicContentResponse {
  mainInfoScreens?: MainInfoPageRecord[],
  performers?: PerformerRecord[],
  performances?: PerformanceRecord[],
  synced: string,
}
