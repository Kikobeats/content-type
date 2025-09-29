'use strict'

const test = require('ava')

const contentType = require('..')

test('parse basic type', t => {
  t.is(contentType('text/html'), 'text/html')
  t.is(contentType('image/svg+xml'), 'image/svg+xml')
  t.is(contentType('text/plain'), 'text/plain')
  t.is(contentType('application/json'), 'application/json')
  t.is(contentType('image/jpeg'), 'image/jpeg')
})

test('should handle complex media types', t => {
  t.is(contentType('application/vnd.api+json'), 'application/vnd.api+json')
  t.is(contentType('application/vnd.ms-excel'), 'application/vnd.ms-excel')
  t.is(contentType('text/vnd.abc+xml'), 'text/vnd.abc+xml')
})

test('trim whitespace', t => {
  t.is(contentType(' text/html '), 'text/html')
  t.is(contentType('text/html;charset=utf-8'), 'text/html')
  t.is(contentType('text/html ;charset=utf-8'), 'text/html')
  t.is(contentType('text/html; charset=utf-8'), 'text/html')
  t.is(contentType('text/html  ;  charset=utf-8  '), 'text/html')
})

test('strip parameters', t => {
  t.is(contentType('text/html; charset=utf-8; foo=bar'), 'text/html')
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar'), 'text/html')
  t.is(contentType('text/html;'), 'text/html')
  t.is(contentType('text/html; '), 'text/html')
})

test('normalize to lower-case', t => {
  t.is(contentType('IMAGE/SVG+XML'), 'image/svg+xml')
  t.is(contentType('Text/HTML'), 'text/html')
  t.is(contentType('APPLICATION/JSON'), 'application/json')
  t.is(contentType('Image/PNG'), 'image/png')
})

test('invalid input', t => {
  t.is(contentType(undefined), null)
  t.is(contentType(null), null)
  t.is(contentType(''), null)
  t.is(contentType(123), null)
  t.is(contentType(0), null)
  t.is(contentType(NaN), null)
  t.is(contentType(true), null)
  t.is(contentType(false), null)
  t.is(contentType([]), null)
  t.is(contentType(['text/html']), null)
})

test('non strict mode', t => {
  t.is(contentType('text / plain'), 'text / plain')
  t.is(contentType('text/;plain'), 'text/')
  t.is(contentType('text/"plain"'), 'text/"plain"')
  t.is(contentType('text/p£ain'), 'text/p£ain')
  t.is(contentType('text/(plain)'), 'text/(plain)')
  t.is(contentType('text/@plain'), 'text/@plain')
  t.is(contentType('text/plain,wrong'), 'text/plain,wrong')
})
