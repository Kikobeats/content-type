'use strict'

const contentType = require('content-type')
const { run, bench } = require('mitata')

const getContentType = require('..')

const testData = [
  'text/html',
  'text/plain',
  'application/json',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/javascript',
  'text/css',
  'application/pdf',
  'video/mp4',
  'text/html; charset=utf-8',
  'application/json; charset=utf-8',
  'text/plain; charset=iso-8859-1',
  'image/jpeg; quality=0.8',
  'text/html; charset=utf-8; boundary=something',
  'application/vnd.api+json',
  'application/vnd.ms-excel',
  'application/x-www-form-urlencoded',
  'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
  'text/html; charset=utf-8; foo=bar',
  'text/html;charset=utf-8',
  'text/html ; charset=utf-8',
  'TEXT/HTML',
  'invalid',
  'text / html',
  'text/;plain',
  'text/"plain"',
  '',
  null,
  undefined
]

bench('@kikobeats/content-type (strict: false)', () => {
  for (const data of testData) {
    getContentType(data, { strict: false })
  }
})

bench('@kikobeats/content-type (strict: true)', () => {
  for (const data of testData) {
    getContentType(data, { strict: true })
  }
})

bench('content-type.parse', () => {
  for (const data of testData) {
    try {
      contentType.parse(data)
    } catch (e) {
      return null
    }
  }
})

run()
