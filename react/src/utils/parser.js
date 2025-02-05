import { attributeGroups, scriptAttributes, styleAttributes, formInputTypes, contentTypeElements, VISIBILITY_CONFIG } from './constants';

export function parseHTML(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    if (doc.body.firstChild && doc.body.firstChild.nodeName === "parsererror") {
      throw new Error("Parser error");
    }
    return doc;
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
  
  // Handle prefixed attributes first
  if (name.startsWith('aria-')) return 'accessibility-roles';
  if (name.startsWith('on')) return 'scripting-behavior';
  if (name.startsWith('data-')) return 'metadata-relationships';
  
  // Special handling for 'type' attribute
  if (name === 'type') {
    if (tag === 'input' || tag === 'button') {
      return 'form-input';
    }
    if (contentTypeElements.includes(tag)) {
      return 'content-source';
    }
  }
  
  // Check regular attribute groups
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