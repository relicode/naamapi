export class InvalidTimeStringError extends Error {
  constructor() {
    super('Invalid time string.')
    Object.setPrototypeOf(this, InvalidTimeStringError.prototype)
  }
}

export const isValidDateString = (date: string | string[]): boolean => (
  [].concat(date).reduce((acc, cur) => (
    acc === false ?
    false :
    !isNaN(Date.parse(cur))
  ), true)
)

export const validateTimeString = (date: string | string[]): boolean => {
  if (!isValidDateString(date)) {
    throw new InvalidTimeStringError()
  }
  return true
}
