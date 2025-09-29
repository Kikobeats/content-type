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

test('parse basic type', t => {
  t.is(contentType('text/html'), 'text/html')
  t.is(contentType('image/svg+xml'), 'image/svg+xml')
})

test('parse with suffix', t => {
  t.is(contentType('image/svg+xml'), 'image/svg+xml')
})

test('parse basic type with surrounding OWS', t => {
  // In non-strict mode, whitespace is trimmed
  t.is(contentType(' text/html '), 'text/html')
})

test('parse parameters', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html; charset=utf-8; foo=bar'), 'text/html')
})

test('parse parameters with extra LWS', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar'), 'text/html')
})

test('should lower-case type', t => {
  t.is(contentType('IMAGE/SVG+XML'), 'image/svg+xml')
})

test('should handle quoted parameter values', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html; charset="UTF-8"'), 'text/html')
})

test('should handle parameter values with escapes', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html; charset = "UT\\F-\\\\\\"8\\""'), 'text/html')
})

test('should handle balanced quotes', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo'), 'text/html')
})

// Test invalid types - these should return null even in non-strict mode
invalidTypes.forEach(type => {
  test(`should handle invalid media type: ${type}`, t => {
    // Invalid media types should return null even in non-strict mode
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
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html; charset=utf-8; boundary=something; foo=bar'), 'text/html')
})

test('should handle content type with whitespace variations', t => {
  // In non-strict mode, parameters are stripped
  t.is(contentType('text/html;charset=utf-8'), 'text/html')
  t.is(contentType('text/html ;charset=utf-8'), 'text/html')
  t.is(contentType('text/html; charset=utf-8'), 'text/html')
  t.is(contentType('text/html  ;  charset=utf-8  '), 'text/html')
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
  // In non-strict mode, semicolons are stripped
  t.is(contentType('text/html;'), 'text/html')
  t.is(contentType('text/html; '), 'text/html')
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
  // Non-string inputs return null
  t.is(contentType([]), null)
  t.is(contentType(['text/html']), null)
})

test('should handle function inputs gracefully', t => {
  // Non-string inputs return null
  t.is(contentType(() => 'text/html'), null)
})
