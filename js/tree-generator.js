function generateTreeHTML(node) {
    if (!node) return '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    try {
        let result = '<li>';
        const hasChildren = node.children.length > 0;
        const textContent = Array.from(node.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .filter(text => text.length > 0)
            .join(' ');

        result += `<span class="${hasChildren ? 'collapsible' : 'leaf'}">`;

        result += '<span class="tag">';
        result += `<span class="tag">${node.tagName.toLowerCase()}</span>`;
        
        if (node.className) {
            let classes;
            if (typeof node.className === 'string') {
                classes = node.className.split(' ');
            } else if (node.className.baseVal) {
                // Handle SVG elements
                classes = node.className.baseVal.split(' ');
            } else {
                classes = [];
            }
            
            classes = classes.filter(c => c.trim() !== '');
            if (classes.length > 0) {
                result += '<span class="class">.' + classes.join('.') + '</span>';
            }
        }
        
        if (node.id) result += `<span class="id">#${node.id}</span>`;

        let attributeGroups = {
            'content-source': [
                // Core resource references
                'src', 'href', 'srcset', 'sizes', 'source', 'icon', 'manifest', 'srcdoc',
                // Resource metadata
                'alt', 'title', 'caption', 'figcaption', 'data',
                // Link behavior
                'target', 'rel', 'download', 'ping',
                // Media specifics
                'media', 'poster', 'preload',
                // Citations & References
                'cite', 'quotation', 'blockquote',
                // Form destinations
                'action', 'formaction',
                // Resource integrity
                'crossorigin', 'integrity', 'referrerpolicy',
                // Progressive enhancement
                'fallback', 'placeholder'
            ],
            'style-appearance': [
                // Core styling
                'style', 'styles', 'class',
                // Dimensions & Layout
                'width', 'height', 'size', 'aspect-ratio', 'align', 'valign', 'shape', 'coords',
                // Layout
                'display', 'position', 'float', 'clear', 'z-index', 'popover',
                // Spacing
                'margin', 'padding', 'gap',
                // Visual
                'background', 'color', 'opacity', 'visibility', 'bgcolor', 'border',
                // Typography
                'font', 'font-family', 'font-size', 'font-weight', 'text-align', 'vertical-align', 'face',
                // Table specific
                'colspan', 'rowspan', 'cellpadding', 'cellspacing', 'rows',
                // Flexbox/Grid
                'flex', 'grid', 'order', 'align', 'justify',
                // Transitions & Animations
                'transition', 'animation', 'transform',
                // SVG-specific styling
                'stroke-opacity'
            ],
            'form-input': [
                // Core attributes
                'type', 'name', 'value', 'form',
                // Validation
                'required', 'pattern', 'minlength', 'maxlength', 'min', 'max',
                // State
                'disabled', 'readonly', 'checked', 'selected', 'multiple',
                // User experience
                'placeholder', 'autocomplete', 'autocapitalize', 'autofocus',
                // File inputs
                'accept', 'capture',
                // Form behavior
                'formmethod', 'formtarget', 'formnovalidate', 'formenctype',
                // Lists & Stepping
                'list', 'step', 'datalist',
                // Mobile optimization
                'inputmode', 'enterkeyhint',
                // Additional form attributes
                'method', 'enctype', 'accept-charset', 'spellcheck', 'for'
            ],
            'accessibility-roles': [
                // ARIA
                'role', 'aria-*',
                // Navigation
                'tabindex', 'accesskey',
                // Language & Direction
                'lang', 'dir',
                // State & Properties
                'hidden', 'disabled', 'readonly',
                // Interactive elements
                'contenteditable', 'draggable', 'dropzone', 'translate',
                // Focus management
                'autofocus', 'focusable',
                // Live regions
                'aria-live', 'aria-atomic',
                // Descriptions
                'aria-label', 'aria-describedby',
                // Additional accessibility
                'for', 'action'
            ],
            'metadata-relationships': [
                // Custom data
                'data-*',
                // Microdata
                'itemscope', 'itemtype', 'itemprop',
                // RDFa
                'vocab', 'typeof', 'property',
                // Time & Dates
                'datetime', 'pubdate',
                // Document structure
                'rel', 'rev', 'about', 'content', 'id', 'name',
                // Namespaces
                'xmlns', 'xml:lang', 'xml:base', 'xml:space',
                // Resource identification
                'resource', 'prefix', 'datatype'
            ],
            'multimedia': [
                'autoplay', 'controls', 'loop', 'muted', 'preload', 'playsinline',
                'volume', 'currenttime', 'duration', 'buffered', 'played', 'seekable',
                'ended', 'defaultmuted', 'defaultplaybackrate', 'disableremoteplayback',
                'controlslist'
            ],
            'scripting-behavior': [
                // Mouse events
                'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave',
                // Keyboard events
                'onkeydown', 'onkeyup', 'onkeypress',
                // Form events
                'onsubmit', 'oninput', 'onchange', 'onformdata', 'oninvalid', 'onreset',
                // Focus events
                'onblur', 'onfocus',
                // Drag events
                'ondrag', 'ondrop', 'ondragend', 'ondragenter', 'ondragexit', 
                'ondragleave', 'ondragover', 'ondragstart',
                // Media events
                'oncanplay', 'oncanplaythrough', 'ondurationchange', 'onemptied', 
                'onended', 'onloadeddata', 'onloadedmetadata', 'onloadstart',
                'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange',
                'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate',
                'onvolumechange', 'onwaiting',
                // Other events
                'onload', 'onscroll', 'onerror', 'onabort', 'onautocomplete', 
                'onautocompleteerror', 'oncancel', 'onclose', 'oncontextmenu',
                'oncuechange', 'onselect', 'onslotchange', 'ontoggle', 'onwheel',
                'onsecuritypolicyviolation',
                // Script attributes
                'async', 'defer', 'nonce'
            ],
            'image-specific': [
                // Basic SVG attributes
                'd', 'viewBox', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r',
                'x', 'y', 'dx', 'dy', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'z1', 'z2',
                // Transform and positioning
                'transform', 'points', 'preserveAspectRatio',
                // Clipping and masking
                'path', 'clip-path', 'mask', 'filter',
                // Advanced SVG attributes
                'vector-effect', 'pointer-events', 'stop-color', 'stop-opacity',
                'text-anchor', 'dominant-baseline', 'stroke-linecap', 'stroke-linejoin',
                'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
                'fill-rule', 'clip-rule', 'enable-background',
                // Gradient and pattern
                'gradientUnits', 'gradientTransform', 'spreadMethod', 'fx', 'fy',
                'offset', 'patternUnits', 'patternTransform',
                // Markers and masks
                'marker-start', 'marker-mid', 'marker-end', 'mask-type', 'mask-units',
                'primitiveUnits',
                // Links and areas
                'xlink:href', 'area', 'img'
            ],
            'other-attributes': []
        };

        for (let attr of node.attributes) {
            if (attr.name === 'class' || attr.name === 'id') continue;
            let grouped = false;
            for (let [group, attrs] of Object.entries(attributeGroups)) {
                if (attrs.includes(attr.name) || 
                    (group === 'metadata-relationships' && attr.name.startsWith('data-')) ||
                    (group === 'accessibility-roles' && attr.name.startsWith('aria-'))) {
                    const sanitizedValue = attr.value
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/`/g, '&#96;');
                    result += `<span class="${group}">[${attr.name}="${sanitizedValue}"]</span>`;
                    grouped = true;
                    break;
                }
            }
            if (!grouped) {
                const sanitizedValue = attr.value
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/`/g, '&#96;');
                result += `<span class="other-attributes">[${attr.name}="${sanitizedValue}"]</span>`;
            }
        }

        if (node.tagName.toLowerCase() === 'script' && node.textContent.trim()) {
            const sanitizedContent = node.textContent.trim()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            result += ` <span class="scripting-behavior">${sanitizedContent}</span>`;
        } else if (node.tagName.toLowerCase() === 'style' && node.textContent.trim()) {
            const sanitizedContent = node.textContent.trim()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            result += ` <span class="style-appearance">${sanitizedContent}</span>`;
        } else if (textContent) {
            const sanitizedContent = textContent
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            result += ` <span class="inner-content">${sanitizedContent}</span>`;
        }

        result += '</span><ul>';
        
        if (hasChildren) {
            for (let child of node.children) {
                result += generateTreeHTML(child);
            }
        }
        
        result += '</ul></li>';
        return result;
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
        if (!input || !input.value.trim()) {
            throw new Error("Empty or invalid input");
        }
        
        const output = visualizeHTML(input.value);
        const outputDiv = document.getElementById('output');
        if (!outputDiv) {
            throw new Error("Output container not found");
        }
        
        outputDiv.innerHTML = output;
        addCollapsibleFunctionality();
        updateVisibility();
    } catch (error) {
        console.error("Error in visualization:", error);
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            outputDiv.innerHTML = `<p class="error">Error: ${error.message || 'An error occurred during visualization. Please check your input HTML.'}</p>`;
        }
    }
}

// Add browser checks
if (!window.DOMParser) {
    console.error("Browser doesn't support DOMParser");
    // Fallback or error message
}