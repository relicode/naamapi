import { createClient } from 'contentful'
import config from '@utils/config'

export const contentfulClient = createClient(config.contentful)
