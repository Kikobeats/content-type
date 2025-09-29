'use strict'

const test = require('ava')

const { invalidTypes } = require('./util')
const contentType = require('..')

test('parse basic type with surrounding OWS', t => {
  t.is(contentType(' text/html ', { strict: true }), null)
})

test('parse parameters', t => {
  t.is(contentType('text/html; charset=utf-8; foo=bar', { strict: true }), null)
})

test('parse parameters with extra LWS', t => {
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar', { strict: true }), null)
})

test('should handle quoted parameter values', t => {
  t.is(contentType('text/html; charset="UTF-8"', { strict: true }), null)
})

test('should handle parameter values with escapes', t => {
  t.is(contentType('text/html; charset = "UT\\F-\\\\\\"8\\""', { strict: true }), null)
})

test('should handle balanced quotes', t => {
  t.is(contentType('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo', { strict: true }), null)
})

invalidTypes.forEach(type => {
  test(`should handle invalid media type: ${type}`, t => {
    const result = contentType(type, { strict: true })
    t.is(result, null)
  })
})

test('should handle content type with multiple parameters', t => {
  t.is(contentType('text/html; charset=utf-8; boundary=something; foo=bar', { strict: true }), null)
})

test('should handle content type with whitespace variations', t => {
  t.is(contentType('text/html;charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html ;charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html; charset=utf-8', { strict: true }), null)
  t.is(contentType('text/html  ;  charset=utf-8  ', { strict: true }), null)
})

test('should handle content type with semicolon but no parameters', t => {
  t.is(contentType('text/html;', { strict: true }), null)
  t.is(contentType('text/html; ', { strict: true }), null)
})
