import * as DOMPurify from 'dompurify'
export const stringToHTML = function (str, styles = false) {
  const parser = new DOMParser()
  str = DOMPurify.sanitize(str, { ADD_ATTR: ['onclick', 'src'], ALLOW_UNKNOWN_PROTOCOLS: true })
  const doc = parser.parseFromString(str, 'text/html')
  if (styles) { doc.body.style.cssText = 'height: auto; overflow: scroll; margin: 0px; background: var(--background-primary);' }
  return doc.body
}
