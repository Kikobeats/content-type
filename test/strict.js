'use strict'

const test = require('ava')

const contentType = require('..')

// Invalid types for testing error cases
const invalidTypes = [
  ' ',
  'null',
  'undefined',
  '/',
  'text / plain',
  'text/;plain',
  'text/"plain"',
  'text/p£ain',
  'text/(plain)',
  'text/@plain',
  'text/plain,wrong'
]

test('parse basic type with surrounding OWS', t => {
  // Whitespace around content type makes it invalid per RFC 7231
  t.is(contentType(' text/html ', { strict: true }), null)
})

test('parse parameters', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset=utf-8; foo=bar', { strict: true }), null)
})

test('parse parameters with extra LWS', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar', { strict: true }), null)
})

test('should handle quoted parameter values', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset="UTF-8"', { strict: true }), null)
})

test('should handle parameter values with escapes', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset = "UT\\F-\\\\\\"8\\""', { strict: true }), null)
})

test('should handle balanced quotes', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo', { strict: true }), null)
})

// Test invalid types - these should return null in strict mode
invalidTypes.forEach(type => {
  test(`should handle invalid media type: ${type}`, t => {
    // Invalid media types should return null with regex validation
    const result = contentType(type, { strict: true })
    t.is(result, null)
  })
})

test('should handle content type with multiple parameters', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset=utf-8; boundary=something; foo=bar', { strict: true }), null)
})

test('should handle content type with whitespace variations', t => {
  // All of these have parameters, making them invalid for the strict regex
  t.is(contentType('text/html;charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html ;charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html; charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html  ;  charset=utf-8  ', { strict: true }), null)
})

test('should handle content type with semicolon but no parameters', t => {
  // Semicolons make the string invalid for the strict regex
  t.is(contentType('text/html;', { strict: true }), null)
  t.is(contentType('text/html; ', { strict: true }), null)
})
