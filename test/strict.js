'use strict'

const test = require('ava')

const contentType = require('..')

test('parse basic type', t => {
  t.is(contentType(' text/html ', { strict: true }), 'text/html')
  t.is(contentType('text/html; charset=utf-8; foo=bar', { strict: true }), 'text/html')
  t.is(contentType('text/html ; charset=utf-8 ; foo=bar', { strict: true }), 'text/html')
  t.is(contentType('text/html; charset="UTF-8"', { strict: true }), 'text/html')
  t.is(contentType('text/html; charset = "UT\\F-\\\\\\"8\\""', { strict: true }), 'text/html')
  t.is(contentType('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo', { strict: true }), 'text/html')
  t.is(contentType('text/html; charset=utf-8; boundary=something; foo=bar', { strict: true }), 'text/html')
  t.is(contentType('text/html;', { strict: true }), 'text/html')
  t.is(contentType('text/html; ', { strict: true }), 'text/html')
  t.is(contentType('text/html;charset=utf-8', { strict: true }), 'text/html')
  t.is(contentType('text/html ;charset=utf-8', { strict: true }), 'text/html')
  t.is(contentType('text/html; charset=utf-8', { strict: true }), 'text/html')
  t.is(contentType('text/html  ;  charset=utf-8  ', { strict: true }), 'text/html')
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

test('strict mode', t => {
  t.is(contentType('text / plain', { strict: true }), null)
  t.is(contentType('text/;plain', { strict: true }), null)
  t.is(contentType('text/"plain"', { strict: true }), null)
  t.is(contentType('text/p£ain', { strict: true }), null)
  t.is(contentType('text/(plain)', { strict: true }), null)
  t.is(contentType('text/@plain', { strict: true }), null)
  t.is(contentType('text/plain,wrong', { strict: true }), null)
})
