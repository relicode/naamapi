/* eslint-disable no-console */

const args = require('yargs').argv
const contentful = require('contentful')

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env

const client = contentful.createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
})

const main = async () => {
  try {
    const entries = await client.getEntries({
      content_type: args.ctype,
    })
    console.log(JSON.stringify(entries, null, 2))
  } catch (e) {
    console.log(e)
    console.log(args)
  }
}

main()

