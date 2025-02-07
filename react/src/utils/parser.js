import { attributeGroups } from './constants';

// Cache attribute group results to improve performance
const attributeGroupCache = new Map();

export function parseHTML(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    // Check for parser errors in the resulting document
    if (doc.body.firstChild && doc.body.firstChild.nodeName === "parsererror") {
      throw new Error("Parser error");
    }
    return doc;
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return document.implementation.createHTMLDocument();
  }
}

export function getAttributeGroup(attrName, tagName) {
  // Use cache to avoid redundant group lookups
  const cacheKey = `${attrName}-${tagName}`;
  if (attributeGroupCache.has(cacheKey)) {
    return attributeGroupCache.get(cacheKey);
  }

  const name = attrName.toLowerCase();
  const tag = tagName.toLowerCase();
  
  // Handle special attribute prefixes that determine their group
  if (name.startsWith('aria-')) return 'accessibility-roles';
  if (name.startsWith('on')) return 'scripting-behavior';
  if (name.startsWith('data-')) return 'metadata-relationships';
  
  // Special case for 'type' attribute based on element context
  if (name === 'type') {
    if (tag === 'input' || tag === 'button') {
      return 'form-input';
    }
  }
  
  // Search through attribute groups for matching attributes
  for (const [group, attrs] of Object.entries(attributeGroups)) {
    if (attrs.includes(name)) {
      attributeGroupCache.set(cacheKey, group);
      return group;
    }
  }
  
  // Default to other-attributes if no specific group is found
  attributeGroupCache.set(cacheKey, 'other-attributes');
  return 'other-attributes';
}

// Prevent memory leaks by clearing cache when it grows too large
if (attributeGroupCache.size > 1000) {
  attributeGroupCache.clear();
} 