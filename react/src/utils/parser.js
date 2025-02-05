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

export function getAttributeGroup(attrName, tagName) {
  const name = attrName.toLowerCase();
  const tag = tagName.toLowerCase();
  
  // Special handling for script and style tags
  if (tag === 'script') {
    return ['type', 'src', 'async', 'defer', 'crossorigin', 'integrity'].includes(name) 
      ? 'scriptingbehavior' 
      : 'otherattributes';
  }

  if (tag === 'style') {
    return ['media', 'type'].includes(name) 
      ? 'styleappearance' 
      : 'otherattributes';
  }

  // Handle prefixed attributes
  if (name.startsWith('aria-')) return 'accessibilityroles';
  if (name.startsWith('on')) return 'scriptingbehavior';
  if (name.startsWith('data-')) return 'metadatarelationships';
  
  const attributeGroups = {
    'contentsource': [
      'src', 'href', 'content', 'value', 'placeholder', 'action', 
      'data-src', 'srcset', 'formaction', 'cite', 'poster'
    ],
    'styleappearance': [
      'style', 'class', 'rel', 'media', 'type', 'hidden', 'display',
      'align', 'valign', 'bgcolor', 'color', 'border', 'background'
    ],
    'forminput': [
      'name', 'required', 'pattern', 'min', 'max', 'step', 'readonly',
      'disabled', 'checked', 'selected', 'for', 'form', 'formmethod',
      'maxlength', 'minlength', 'multiple', 'autofocus', 'autocomplete'
    ],
    'accessibilityroles': [
      'role', 'tabindex', 'title', 'alt', 'lang', 'aria-label',
      'aria-describedby', 'aria-hidden', 'aria-live', 'aria-atomic',
      'accesskey', 'draggable'
    ],
    'metadatarelationships': [
      'charset', 'name', 'property', 'itemprop', 'itemtype', 'id',
      'http-equiv', 'scheme', 'about', 'rev', 'xmlns', 'version'
    ],
    'multimedia': [
      'controls', 'autoplay', 'loop', 'muted', 'preload', 'kind',
      'track', 'buffered', 'volume', 'playsinline'
    ],
    'imagespecific': [
      'loading', 'srcset', 'sizes', 'width', 'height', 'decoding',
      'referrerpolicy', 'fetchpriority', 'crossorigin', 'ismap', 'usemap',
      'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'points',
      'transform', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry'
    ],
    'scriptingbehavior': [
      'type', 'defer', 'async', 'nomodule', 'nonce', 'integrity',
      'importance', 'blocking', 'fetchpriority'
    ]
  };

  for (const [group, attrs] of Object.entries(attributeGroups)) {
    if (attrs.includes(name)) return group;
  }
  
  return 'otherattributes';
} 