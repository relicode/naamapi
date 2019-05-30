# naamapi
Serverless API for the Naamat festival application

## Requirements

Requires global `serverless` package and AWS credentials (default profile: naamapi-admin).
Install [`jq`](https://stedolan.github.io/jq/) if you want to use commands like `yarn list:performers`.

## Installation
Run `yarn` to install dependencies.

## Setup
In .env file, set the following environment variables:
  - `CONTENTFUL_ACCESS_TOKEN` Access token to Contentful CDN
  - `CONTENTFUL_SPACE_ID` SpaceId for Contentful Space
  - `SECURITY_GROUP_ID` AWS VPC Security group id
  - `SUBNET_ID` AWS VPC Subnet id

## Run development server
`sls offline`

## Deploy
`sls deploy -s {stage}`
