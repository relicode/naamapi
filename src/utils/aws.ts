import AWS from 'aws-sdk'

const { region } = process.env

AWS.config.setPromisesDependency(Promise)
AWS.config.update({
  region,
})

export default AWS

export const S3 = new AWS.S3({ apiVersion: '2006-03-01' })
