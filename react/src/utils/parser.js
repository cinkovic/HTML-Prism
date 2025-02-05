export function parseHTML(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    if (doc.body.firstChild && doc.body.firstChild.nodeName === "parsererror") {
      throw new Error("Parser error");
    }
    return doc;  // Return the whole document instead of just body
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return document.implementation.createHTMLDocument();
  }
}

// Cache attribute group results
const attributeGroupCache = new Map();

export function getAttributeGroup(attrName, tagName) {
  const cacheKey = `${attrName}-${tagName}`;
  if (attributeGroupCache.has(cacheKey)) {
    return attributeGroupCache.get(cacheKey);
  }

  const name = attrName.toLowerCase();
  const tag = tagName.toLowerCase();
  
  // Special handling for script and style tags
  if (tag === 'script') {
    let result = ['type', 'src', 'async', 'defer', 'crossorigin', 'integrity'].includes(name) 
      ? 'scripting-behavior' 
      : 'other-attributes';
    attributeGroupCache.set(cacheKey, result);
    return result;
  }

  if (tag === 'style') {
    let result = ['media', 'type'].includes(name) 
      ? 'style-appearance' 
      : 'other-attributes';
    attributeGroupCache.set(cacheKey, result);
    return result;
  }

  // Handle prefixed attributes
  if (name.startsWith('aria-')) {
    let result = 'accessibility-roles';
    attributeGroupCache.set(cacheKey, result);
    return result;
  }
  if (name.startsWith('on')) {
    let result = 'scripting-behavior';
    attributeGroupCache.set(cacheKey, result);
    return result;
  }
  if (name.startsWith('data-')) {
    let result = 'metadata-relationships';
    attributeGroupCache.set(cacheKey, result);
    return result;
  }
  
  const attributeGroups = {
    'content-source': [
      'src', 'href', 'content', 'value', 'placeholder', 'action', 
      'data-src', 'srcset', 'formaction', 'cite', 'poster'
    ],
    'style-appearance': [
      'style', 'class', 'rel', 'media', 'type', 'hidden', 'display',
      'align', 'valign', 'bgcolor', 'color', 'border', 'background'
    ],
    'form-input': [
      'name', 'required', 'pattern', 'min', 'max', 'step', 'readonly',
      'disabled', 'checked', 'selected', 'for', 'form', 'formmethod',
      'maxlength', 'minlength', 'multiple', 'autofocus', 'autocomplete'
    ],
    'accessibility-roles': [
      'role', 'tabindex', 'title', 'alt', 'lang', 'aria-label',
      'aria-describedby', 'aria-hidden', 'aria-live', 'aria-atomic',
      'accesskey', 'draggable'
    ],
    'metadata-relationships': [
      'charset', 'name', 'property', 'itemprop', 'itemtype', 'id',
      'http-equiv', 'scheme', 'about', 'rev', 'xmlns', 'version'
    ],
    'multimedia': [
      'controls', 'autoplay', 'loop', 'muted', 'preload', 'kind',
      'track', 'buffered', 'volume', 'playsinline'
    ],
    'image-specific': [
      'loading', 'srcset', 'sizes', 'width', 'height', 'decoding',
      'referrerpolicy', 'fetchpriority', 'crossorigin', 'ismap', 'usemap',
      'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'points',
      'transform', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry'
    ],
    'scripting-behavior': [
      'type', 'defer', 'async', 'nomodule', 'nonce', 'integrity',
      'importance', 'blocking', 'fetchpriority'
    ]
  };

  for (const [group, attrs] of Object.entries(attributeGroups)) {
    if (attrs.includes(name)) {
      let result = group;
      attributeGroupCache.set(cacheKey, result);
      return result;
    }
  }
  
  let result = 'other-attributes';
  attributeGroupCache.set(cacheKey, result);
  return result;
}

// Clear cache when it gets too large
if (attributeGroupCache.size > 1000) {
  attributeGroupCache.clear();
} 