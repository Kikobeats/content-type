/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
const TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/

module.exports = (input, { strict = false } = {}) => {
  if (typeof input !== 'string' || !input) return null
  if (strict && !TYPE_REGEXP.test(input)) return null
  return input.split(';')[0].trim().toLowerCase()
}
