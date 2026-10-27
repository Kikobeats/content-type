'use strict'

const { spawnSync } = require('child_process')
const { writeFileSync } = require('fs')
const { join } = require('path')

const getContentType = require('..')

const RUNS = 7
const PINNED_HASH_SEED_FLAG = '--hash-seed=1'
const ITERATIONS = 150_000

const BOUNDARY =
  'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'

const FIXTURES = [
  ['text/html', 'text/html', 'text/html'],
  ['text/plain', 'text/plain', 'text/plain'],
  ['application/json', 'application/json', 'application/json'],
  ['image/jpeg', 'image/jpeg', 'image/jpeg'],
  ['image/png', 'image/png', 'image/png'],
  ['image/svg+xml', 'image/svg+xml', 'image/svg+xml'],
  [
    'application/javascript',
    'application/javascript',
    'application/javascript'
  ],
  ['text/css', 'text/css', 'text/css'],
  ['application/pdf', 'application/pdf', 'application/pdf'],
  ['video/mp4', 'video/mp4', 'video/mp4'],
  ['text/html; charset=utf-8', 'text/html', 'text/html'],
  ['application/json; charset=utf-8', 'application/json', 'application/json'],
  ['text/plain; charset=iso-8859-1', 'text/plain', 'text/plain'],
  ['image/jpeg; quality=0.8', 'image/jpeg', 'image/jpeg'],
  ['text/html; charset=utf-8; boundary=something', 'text/html', 'text/html'],
  [
    'application/vnd.api+json',
    'application/vnd.api+json',
    'application/vnd.api+json'
  ],
  [
    'application/vnd.ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.ms-excel'
  ],
  [
    'application/x-www-form-urlencoded',
    'application/x-www-form-urlencoded',
    'application/x-www-form-urlencoded'
  ],
  [BOUNDARY, 'multipart/form-data', 'multipart/form-data'],
  ['text/html; charset=utf-8; foo=bar', 'text/html', 'text/html'],
  ['text/html;charset=utf-8', 'text/html', 'text/html'],
  ['text/html ; charset=utf-8', 'text/html', 'text/html'],
  ['TEXT/HTML', 'text/html', 'text/html'],
  ['invalid', 'invalid', null],
  ['text / html', 'text / html', null],
  ['text/;plain', 'text/', null],
  ['text/"plain"', 'text/"plain"', null],
  ['', null, null],
  [null, null, null],
  [undefined, null, null]
]

const INPUTS = FIXTURES.map(([input]) => input)
const LOOSE_EXPECTED = FIXTURES.map(([, loose]) => loose)
const STRICT_EXPECTED = FIXTURES.map(([, , strict]) => strict)

const median = values => {
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const countMismatches = (options, expected) => {
  let failures = 0
  for (let j = 0; j < INPUTS.length; j++) {
    if (getContentType(INPUTS[j], options) !== expected[j]) failures++
  }
  return failures
}

const parseCase = (name, options, expected) => ({
  name,
  run: () => {
    let failures = 0
    for (let i = 0; i < ITERATIONS; i++) { failures += countMismatches(options, expected) }
    if (failures > 0) throw new Error(`${name}: ${failures} wrong results`)
  }
})

const CASES = [
  parseCase('parse non-strict', { strict: false }, LOOSE_EXPECTED),
  parseCase('parse strict', { strict: true }, STRICT_EXPECTED)
]

const sample = entry => {
  const samples = []
  let errors = 0
  for (let run = 0; run <= RUNS; run++) {
    const started = process.hrtime.bigint()
    try {
      entry.run()
      if (run > 0) samples.push(Number(process.hrtime.bigint() - started) / 1e6)
    } catch (error) {
      errors++
      console.error(error)
    }
  }
  return { samples, errors }
}

const fmt = value => value.toFixed(1)

const report = (entry, { samples, errors }) => {
  const med = samples.length ? median(samples) : Number.NaN
  const min = samples.length ? Math.min(...samples) : Number.NaN
  const max = samples.length ? Math.max(...samples) : Number.NaN
  const extra = `work ${ITERATIONS * INPUTS.length} parses (${
    INPUTS.length
  } inputs x ${ITERATIONS}), errors ${errors}, runs ${RUNS}`
  console.log(
    `${entry.name}  median ${fmt(med)}ms  range ${fmt(min)}-${fmt(
      max
    )}  ${extra}`
  )
  return {
    name: entry.name,
    unit: 'ms',
    value: Number(fmt(med)),
    range: `${fmt(min)}-${fmt(max)}`,
    extra
  }
}

const main = () => {
  const results = []
  let errors = 0
  for (const entry of CASES) {
    const result = sample(entry)
    errors += result.errors
    results.push(report(entry, result))
  }
  writeFileSync(
    join(__dirname, '..', 'benchmark-output.json'),
    JSON.stringify(results, null, 2) + '\n'
  )
  if (errors > 0 || results.some(result => !Number.isFinite(result.value))) {
    process.exitCode = 1
  }
}

const runWithPinnedHashSeed = () => {
  const child = spawnSync(
    process.execPath,
    [PINNED_HASH_SEED_FLAG, __filename],
    {
      stdio: 'inherit'
    }
  )
  process.exitCode = child.status ?? 1
}

if (process.execArgv.includes(PINNED_HASH_SEED_FLAG)) main()
else runWithPinnedHashSeed()
