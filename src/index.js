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
  const end = input.indexOf(';')
  const type = end === -1 ? input : input.slice(0, end)
  const normalized = type.trim().toLowerCase()
  if (strict && !TYPE_REGEXP.test(normalized)) return null
  return normalized
}
