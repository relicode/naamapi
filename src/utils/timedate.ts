import moment from 'moment'

export const toIsoString = (dateTime: string): string => moment(dateTime).toISOString()
