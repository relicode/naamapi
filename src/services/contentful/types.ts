import { Omit } from '@utils/types'

export interface MainInfoPageFields {
  content: string,
  headerImage: any
  order: number,
  title: string,
}

export type TrimmedMainInfoPageFields = Omit<MainInfoPageFields, 'headerImage'>

export interface RecordFields {
  createdAt: string,
  headerImage: string,
  updatedAt: string,
}

export interface TrimmedMainInfoPageEntry extends TrimmedMainInfoPageFields, RecordFields {
  headerImage: string,
}
