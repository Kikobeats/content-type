'use strict'

const test = require('ava')

const contentType = require('@kikobeats/content-type')

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

test('parse basic type', t => {
  t.is(contentType('text/html'), 'text/html')
  t.is(contentType('image/svg+xml'), 'image/svg+xml')
})

test('parse with suffix', t => {
  t.is(contentType('image/svg+xml'), 'image/svg+xml')
})

test('parse basic type with surrounding OWS', t => {
  // Whitespace around content type makes it invalid per RFC 7231
  t.is(contentType(' text/html '), null)
})

test('parse parameters', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset=utf-8; foo=bar'), null)
})

test('parse parameters with extra LWS', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar'), null)
})

test('should lower-case type', t => {
  t.is(contentType('IMAGE/SVG+XML'), 'image/svg+xml')
})

test('should handle quoted parameter values', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset="UTF-8"'), null)
})

test('should handle parameter values with escapes', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset = "UT\\F-\\\\\\"8\\""'), null)
})

test('should handle balanced quotes', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo'), null)
})

// Test invalid types - these should return null
invalidTypes.forEach(type => {
  test(`should handle invalid media type: ${type}`, t => {
    // Invalid media types should return null with regex validation
    const result = contentType(type)
    t.is(result, null)
  })
})

test('should handle undefined input', t => {
  t.is(contentType(undefined), null)
})

test('should handle null input', t => {
  t.is(contentType(null), null)
})

test('should handle empty string', t => {
  t.is(contentType(''), null)
})

// Test with request-like objects
test('should handle object with headers property', t => {
  const req = { headers: { 'content-type': 'text/html' } }
  // Objects are not strings, so they return null
  t.is(contentType(req), null)
})

// Test with response-like objects
test('should handle object with getHeader method', t => {
  const res = { getHeader: () => 'text/html' }
  // Objects are not strings, so they return null
  t.is(contentType(res), null)
})

// Additional edge case tests
test('should handle content type with multiple parameters', t => {
  // Parameters make the string invalid for the strict regex
  t.is(contentType('text/html; charset=utf-8; boundary=something; foo=bar'), null)
})

test('should handle content type with whitespace variations', t => {
  // All of these have parameters, making them invalid for the strict regex
  t.is(contentType('text/html;charset=utf-8'), null)
  t.is(contentType('text/html ;charset=utf-8'), null)
  t.is(contentType('text/html; charset=utf-8'), null)
  t.is(contentType('text/html  ;  charset=utf-8  '), null)
})

test('should handle mixed case content types', t => {
  t.is(contentType('Text/HTML'), 'text/html')
  t.is(contentType('APPLICATION/JSON'), 'application/json')
  t.is(contentType('Image/PNG'), 'image/png')
})

test('should handle complex media types', t => {
  t.is(contentType('application/vnd.api+json'), 'application/vnd.api+json')
  t.is(contentType('application/vnd.ms-excel'), 'application/vnd.ms-excel')
  t.is(contentType('text/vnd.abc+xml'), 'text/vnd.abc+xml')
})

test('should handle content type with no parameters', t => {
  t.is(contentType('text/plain'), 'text/plain')
  t.is(contentType('application/json'), 'application/json')
  t.is(contentType('image/jpeg'), 'image/jpeg')
})

test('should handle content type with semicolon but no parameters', t => {
  // Semicolons make the string invalid for the strict regex
  t.is(contentType('text/html;'), null)
  t.is(contentType('text/html; '), null)
})

test('should handle numeric inputs gracefully', t => {
  // Non-string inputs return null
  t.is(contentType(123), null)
  t.is(contentType(0), null)
  t.is(contentType(NaN), null)
})

test('should handle boolean inputs gracefully', t => {
  // Non-string inputs return null
  t.is(contentType(true), null)
  t.is(contentType(false), null)
})

test('should handle array inputs gracefully', t => {
  // Arrays may cause errors due to .split() call, so we test for that
  t.is(contentType([]), null)
  // This specific array might cause an error due to implementation details
  t.throws(() => contentType(['text/html']))
})

test('should handle function inputs gracefully', t => {
  // Non-string inputs return null
  t.is(contentType(() => 'text/html'), null)
})
