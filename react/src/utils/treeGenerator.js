import { getAttributeGroup } from './parser';

// Cache for storing escaped HTML strings to improve performance
const escapeCache = new Map();

// Safely escapes HTML special characters with caching
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

// Determines if node content should be treated as raw text (script/style)
const isScriptOrStyle = (node) => {
  const tag = node.tagName.toLowerCase();
  return tag === 'script' || tag === 'style';
};

// Identifies nodes whose text content should be omitted from the tree view
const shouldSkipTextContent = (node) => {
  // Remove script and style from this check, only skip meta and head content
  return node.tagName.toLowerCase() === 'head' ||
         node.tagName.toLowerCase() === 'meta';
};

export function generateTreeHTML(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return '';

  try {
    // Build HTML tree structure with collapsible functionality
    // Special handling for HTML tag as root element
    const tagName = node.tagName.toLowerCase();
    const hasChildren = node.children.length > 0;
    
    const isHtmlTag = tagName === 'html';
    const collapsibleClass = isHtmlTag ? '' : `collapsible${hasChildren ? '' : ' no-arrow'}`;
    
    // Array-based string concatenation for better performance
    const parts = [`<li><span class="${collapsibleClass}">`];
    
    // Process node attributes in specific order: tag, classes, ID, other attributes
    // Each attribute type gets its own styling class for visibility toggling
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
        if (!processedAttrs.has(attr.name)) {
          processedAttrs.set(attr.name, 
            `<span class="${group}">[${attr.name}="${escapeHTML(attr.value)}"]</span>`);
        }
      }
    }
    parts.push(...processedAttrs.values());

    // Special handling for script/style content and text nodes
    if (isScriptOrStyle(node)) {
      const content = node.textContent.trim();
      if (content) {
        // Use scripting-behavior for script content and style-appearance for style content
        const contentClass = tagName === 'script' ? 'scripting-behavior' : 'style-appearance';
        parts.push(` <span class="${contentClass}">{${escapeHTML(content)}}</span>`);
      }
    } else if (!shouldSkipTextContent(node)) {
      const textNodes = Array.from(node.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .map(node => node.textContent.trim());
      
      if (textNodes.length) {
        parts.push(` <span class="inner-content">${escapeHTML(textNodes.join(' '))}</span>`);
      }
    }

    parts.push('</span>');

    // Recursively process child nodes
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