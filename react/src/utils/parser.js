export function parseHTML(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    if (doc.body.firstChild && doc.body.firstChild.nodeName === "parsererror") {
      throw new Error("Parser error");
    }
    return doc.body;
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return document.createElement('body');
  }
}

export function getAttributeGroup(attrName) {
  const name = attrName.toLowerCase();
  
  if (name.startsWith('aria-')) return 'accessibility-roles';
  if (name.startsWith('on')) return 'scripting-behavior';
  if (name.startsWith('data-')) return 'metadata-relationships';
  
  const attributeGroups = {
    'content-source': ['src', 'href', 'content', 'value', 'placeholder', 'action'],
    'style-appearance': ['style', 'class'],
    'form-input': ['required', 'pattern', 'min', 'max', 'step', 'readonly', 'disabled'],
    'accessibility-roles': ['role', 'tabindex', 'alt', 'lang'],
    'metadata-relationships': ['charset', 'name', 'property', 'itemprop', 'itemtype'],
    'multimedia': ['controls', 'autoplay', 'loop', 'muted', 'preload', 'poster'],
    'image-specific': ['loading', 'srcset', 'sizes', 'width', 'height'],
    'scripting-behavior': ['type', 'defer', 'async']
  };

  for (const [group, attrs] of Object.entries(attributeGroups)) {
    if (attrs.includes(name)) return group;
  }
  
  return 'other-attributes';
} 