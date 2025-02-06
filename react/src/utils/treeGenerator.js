import { getAttributeGroup } from './parser';

// Cache escaped HTML strings
const escapeCache = new Map();

const escapeHTML = (str) => {
  if (escapeCache.has(str)) {
    return escapeCache.get(str);
  }

  const escaped = str.replace(/[<>"'`]/g, m => ({
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  })[m]);

  escapeCache.set(str, escaped);
  return escaped;
};

// Clear cache periodically
if (escapeCache.size > 1000) {
  escapeCache.clear();
}

const isScriptOrStyle = (node) => {
  const tag = node.tagName.toLowerCase();
  return tag === 'script' || tag === 'style';
};

const shouldSkipTextContent = (node) => {
  return isScriptOrStyle(node) || 
         node.tagName.toLowerCase() === 'head' ||
         node.tagName.toLowerCase() === 'meta';
};

export function generateTreeHTML(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return '';

  try {
    const tagName = node.tagName.toLowerCase();
    const hasChildren = node.children.length > 0;
    
    // Special case for HTML tag - no collapsible class
    const isHtmlTag = tagName === 'html';
    const collapsibleClass = isHtmlTag ? '' : `collapsible${hasChildren ? '' : ' no-arrow'}`;
    
    const parts = [`<li><span class="${collapsibleClass}">`];
    
    // Add tag name
    parts.push(`<span class="tag">${tagName}</span>`);

    // Process classes
    if (node.className && typeof node.className === 'string') {
      const classes = node.className.split(' ').filter(Boolean);
      if (classes.length) {
        parts.push(`<span class="class">.${classes.join('.')}</span>`);
      }
    }

    // Process ID
    if (node.id) {
      parts.push(`<span class="id">#${node.id}</span>`);
    }

    // Process attributes
    const processedAttrs = new Map();
    for (const attr of node.attributes) {
      if (attr.name !== 'class' && attr.name !== 'id') {
        const group = getAttributeGroup(attr.name, tagName);
        // Keep the hyphen in the class name to match CSS
        if (!processedAttrs.has(attr.name)) {
          processedAttrs.set(attr.name, 
            `<span class="${group}">[${attr.name}="${escapeHTML(attr.value)}"]</span>`);
        }
      }
    }
    parts.push(...processedAttrs.values());

    // Handle text content
    if (!shouldSkipTextContent(node)) {
      const textNodes = Array.from(node.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .map(node => node.textContent.trim());
      
      if (textNodes.length) {
        parts.push(` <span class="inner-content">${escapeHTML(textNodes.join(' '))}</span>`);
      }
    }

    parts.push('</span>');

    // Handle children
    if (hasChildren) {
      parts.push('<ul>');
      for (const child of node.children) {
        parts.push(generateTreeHTML(child));
      }
      parts.push('</ul>');
    }

    parts.push('</li>');
    return parts.join('');
  } catch (error) {
    console.error("Error processing node:", error);
    return `<li><span class="error">Error processing node: ${error.message}</span></li>`;
  }
}