import * as dotenv from 'dotenv'

dotenv.config()

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env

export const contentful = {
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  space: CONTENTFUL_SPACE_ID,
}
