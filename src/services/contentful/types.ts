import { Omit } from '@utils/types'

export interface MainInfoPageFields {
  content: string,
  headerImage: any
  order: number,
  title: string,
}

export type TrimmedMainInfoPageFields = Omit<MainInfoPageFields, 'headerImage'>

export interface HeaderImage {
  url: string,
  width: number,
  height: number,
}

export interface RecordFields {
  createdAt: string,
  headerImage: HeaderImage,
  updatedAt: string,
}

export interface TrimmedMainInfoPageEntry extends TrimmedMainInfoPageFields, RecordFields {}
