# naamapi
Serverless API for the Naamat festival application

## Requirements

Requires global `serverless` package and AWS credentials (default profile: naamapi-admin)

## Installation
Run `yarn` to install dependencies.

## Setup
Set `CONTENTFUL_ACCESS_TOKEN` and `CONTENTFUL_SPACE_ID` in `.env` file and AWS VPC `securityGroupIds` and `subnetIds` in config.yml.

## Run development server
`sls offline`

## Deploy
`sls deploy -s {stage}`
