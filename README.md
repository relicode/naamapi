# naamapi
Serverless API for the Naamat festival application

## Requirements

Requires global `serverless` package (at time of development, version 1.44.1 used) and AWS credentials (default profile: naamapi-admin).
Install [`jq`](https://stedolan.github.io/jq/) if you want to use commands like `yarn list:performers`.

In order for AWS lambdas to access S3 and Onesignal, you need to setup a
[`VPC with NAT Gateway`](https://serverless.com/framework/docs/providers/aws/guide/functions/).

## Installation
Run `yarn` to install dependencies.

## Setup
In the appropriate .env file, set the following environment variables:
  - `CONTENTFUL_ACCESS_TOKEN` Access token to Contentful CDN
  - `CONTENTFUL_SPACE_ID` SpaceId for Contentful Space
  - `SECURITY_GROUP_ID` AWS VPC Security group id
  - `SUBNET_ID` AWS VPC Subnet id
  - `ONESIGNAL_APP_ID` AppId from Onesignal
  - `ONESIGNAL_REST_API_KEY` Private REST API key from Onesignal

## Run development server
`sls offline`

## Deploy
`sls deploy -s {stage}`
