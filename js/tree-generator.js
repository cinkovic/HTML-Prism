const attributeGroups = {
    'content-source': ['src', 'href', 'content', 'value', 'placeholder'],
    'style-appearance': ['style', 'rel', 'media', 'type', 'defer', 'async'],
    'form-input': ['name', 'required', 'pattern', 'min', 'max', 'step', 'readonly', 'disabled', 'checked', 'selected', 'for'],
    'accessibility-roles': ['role', 'tabindex', 'title', 'alt', 'lang', 'hidden'],
    'metadata-relationships': ['charset', 'name', 'property', 'rel', 'itemprop', 'itemtype'],
    'multimedia': ['controls', 'autoplay', 'loop', 'muted', 'preload'],
    'scripting-behavior': ['onclick', 'onsubmit', 'onload', 'onchange', 'oninput'],
    'image-specific': ['width', 'height', 'loading', 'srcset', 'sizes'],
    'other-attributes': []
};

function generateTreeHTML(node) {
    if (!node) return '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    try {
        // Use array joining instead of string concatenation for better performance
        const parts = ['<li>'];
        const hasChildren = node.children.length > 0;
        
        // Get text content once and cache it
        const textNodes = Array.from(node.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
            .map(node => node.textContent.trim());
        const textContent = textNodes.length ? textNodes.join(' ') : '';

        parts.push(`<span class="collapsible${!hasChildren ? ' no-arrow' : ''}">`);
        parts.push(`<span class="tag">${node.tagName.toLowerCase()}</span>`);
        
        // Optimize class handling
        if (node.className) {
            const classes = (typeof node.className === 'string' ? 
                node.className : 
                node.className.baseVal || ''
            ).split(' ').filter(c => c.trim());
            
            if (classes.length) {
                parts.push('<span class="class">.' + classes.join('.') + '</span>');
            }
        }
        
        if (node.id) {
            parts.push(`<span class="id">#${node.id}</span>`);
        }

        // Cache attribute groups for faster lookup
        const attrGroupMap = new Map();
        for (const [group, attrs] of Object.entries(attributeGroups)) {
            attrs.forEach(attr => attrGroupMap.set(attr, group));
        }

        // Process attributes more efficiently
        const processedAttrs = [];
        for (const attr of node.attributes) {
            if (attr.name === 'class' || attr.name === 'id') continue;

            let group = attrGroupMap.get(attr.name);
            
            // Handle special cases
            if (!group) {
                if (attr.name.startsWith('data-')) {
                    group = 'metadata-relationships';
                } else if (attr.name.startsWith('aria-')) {
                    group = 'accessibility-roles';
                } else {
                    group = 'other-attributes';
                }
            }

            const sanitizedValue = attr.value
                .replace(/[<>"'`]/g, m => ({
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '`': '&#96;'
                })[m]);

            processedAttrs.push(`<span class="${group}">[${attr.name}="${sanitizedValue}"]</span>`);
        }
        parts.push(processedAttrs.join(''));

        // Handle special content
        if (node.tagName.toLowerCase() === 'script' && node.textContent.trim()) {
            parts.push(` <span class="scripting-behavior">${node.textContent.trim().replace(/[<>]/g, m => m === '<' ? '&lt;' : '&gt;')}</span>`);
        } else if (node.tagName.toLowerCase() === 'style' && node.textContent.trim()) {
            parts.push(` <span class="style-appearance">${node.textContent.trim().replace(/[<>]/g, m => m === '<' ? '&lt;' : '&gt;')}</span>`);
        } else if (textContent) {
            parts.push(` <span class="inner-content">${textContent.replace(/[<>]/g, m => m === '<' ? '&lt;' : '&gt;')}</span>`);
        }

        parts.push('</span><ul>');
        
        // Process children
        if (hasChildren) {
            for (const child of node.children) {
                parts.push(generateTreeHTML(child));
            }
        }
        
        parts.push('</ul></li>');
        return parts.join('');
    } catch (error) {
        console.error("Error generating tree for node:", node, error);
        return `<li><span class="error">Error processing node: ${error.message}</span></li>`;
    }
}

function visualizeHTML(htmlString) {
    const rootNode = parseHTML(htmlString);
    return '<ul>' + generateTreeHTML(rootNode) + '</ul>';
}

function visualize() {
    try {
        const input = document.getElementById('input');
        if (!input?.value.trim()) {
            throw new Error("Empty or invalid input");
        }
        
        const outputDiv = document.getElementById('output');
        if (!outputDiv) {
            throw new Error("Output container not found");
        }

        // Clear previous content to help GC
        outputDiv.innerHTML = '';
        
        // Process in chunks for large documents
        requestAnimationFrame(() => {
            const output = visualizeHTML(input.value);
            outputDiv.innerHTML = output;
            
            // Add event listeners after DOM is updated
            requestAnimationFrame(() => {
                addCollapsibleFunctionality();
                updateVisibility();
            });
        });
    } catch (error) {
        console.error("Error in visualization:", error);
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            outputDiv.innerHTML = `<p class="error">Error: ${error.message || 'An error occurred during visualization. Please check your input HTML.'}</p>`;
        }
    }
}

// Add cleanup function
function cleanup() {
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML = '';
    }
}

// Add window event listeners for cleanup
window.addEventListener('beforeunload', cleanup);

// Add browser checks
if (!window.DOMParser) {
    console.error("Browser doesn't support DOMParser");
    // Fallback or error message
}