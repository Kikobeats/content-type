/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
const TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/

module.exports = (input, { strict = false } = {}) => {
  // Handle non-string inputs
  if (typeof input !== 'string') {
    return null
  }

  // Handle empty string
  if (input === '') {
    return null
  }

  // Extract the media type part (before semicolon)
  const mediaType = input.split(';')[0].trim().toLowerCase()

  // Always validate the basic media type format
  if (!TYPE_REGEXP.test(mediaType)) {
    return null
  }

  if (strict) {
    // In strict mode, also validate the full input (no parameters allowed)
    if (!TYPE_REGEXP.test(input)) {
      return null
    }
  }

  return mediaType
}
