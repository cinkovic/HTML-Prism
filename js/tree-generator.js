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

// Cache frequently used values
const ELEMENT_NODE = Node.ELEMENT_NODE;
const TEXT_NODE = Node.TEXT_NODE;
const escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
};

// Memoize attribute group lookups
const attrGroupMap = new Map();
Object.entries(attributeGroups).forEach(([group, attrs]) => {
    attrs.forEach(attr => attrGroupMap.set(attr, group));
});

// Constants for chunking and memory management
const CHUNK_SIZE = 50; // Process fewer nodes at once
const VIEWPORT_BUFFER = 1000; // Pixels above/below viewport to keep rendered
const DEBOUNCE_DELAY = 150; // ms to wait before processing scroll events

// Constants for state management
const nodeCache = new WeakMap();
const STATE = {
    isProcessing: false,
    lastVisibleState: new Map(),
    scrollTimeout: null
};

function escapeHTML(str) {
    return str.replace(/[<>"'`]/g, m => escapeMap[m]);
}

function getAttributeGroup(attrName) {
    let group = attrGroupMap.get(attrName);
    if (!group) {
        if (attrName.startsWith('data-')) return 'metadata-relationships';
        if (attrName.startsWith('aria-')) return 'accessibility-roles';
        return 'other-attributes';
    }
    return group;
}

function generateTreeHTML(node) {
    if (!node || node.nodeType !== ELEMENT_NODE) return '';

    try {
        const isBodyTag = node.tagName.toLowerCase() === 'body';
        const hasChildren = node.children.length > 0;
        const tagName = node.tagName.toLowerCase();
        
        // Special handling for body tag - no tree graphics and no arrow
        const parts = isBodyTag ? 
            ['<li style="list-style: none;"><span class="collapsible no-tree">'] : 
            [`<li><span class="collapsible${hasChildren ? '' : ' no-arrow'}">`];
        
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

        // Process other attributes
        for (const attr of node.attributes) {
            if (attr.name !== 'class' && attr.name !== 'id') {
                const group = getAttributeGroup(attr.name);
                parts.push(`<span class="${group}">[${attr.name}="${escapeHTML(attr.value)}"]</span>`);
            }
        }

        parts.push('</span>');

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

function addViewportManagement() {
    const output = document.getElementById('output');
    if (!output) return;

    // Remove previous listener if exists
    output.removeEventListener('scroll', handleScroll);
    output.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    if (STATE.scrollTimeout) {
        clearTimeout(STATE.scrollTimeout);
    }
    
    STATE.scrollTimeout = setTimeout(() => {
        if (!STATE.isProcessing) {
            cleanupOffscreenContent();
        }
    }, DEBOUNCE_DELAY);
}

function cleanupOffscreenContent() {
    const output = document.getElementById('output');
    if (!output) return;

    const viewportTop = output.scrollTop - VIEWPORT_BUFFER;
    const viewportBottom = output.scrollTop + output.clientHeight + VIEWPORT_BUFFER;

    output.querySelectorAll('li').forEach(li => {
        const rect = li.getBoundingClientRect();
        const elementTop = li.offsetTop;
        const elementBottom = elementTop + rect.height;

        if (elementBottom < viewportTop || elementTop > viewportBottom) {
            const ul = li.querySelector('ul');
            if (ul && !li.classList.contains('collapsed')) {
                // Cache and cleanup if not already collapsed
                nodeCache.set(li, ul.innerHTML);
                ul.innerHTML = '';
                li.classList.add('offscreen');
            }
        } else if (li.classList.contains('offscreen')) {
            // Restore content if element is back in view
            const ul = li.querySelector('ul');
            if (ul && nodeCache.has(li)) {
                ul.innerHTML = nodeCache.get(li);
                li.classList.remove('offscreen');
                addCollapsibleFunctionality();
                restoreVisibilityState(ul);
            }
        }
    });
}

function addCollapsibleFunctionality() {
    document.querySelectorAll('.collapsible').forEach(item => {
        item.removeEventListener('click', handleCollapse);
        item.addEventListener('click', handleCollapse);
    });
}

function handleCollapse(e) {
    if (STATE.isProcessing) return;
    STATE.isProcessing = true;
    
    try {
        e.stopPropagation();
        const parentLi = this.parentElement;
        const ul = parentLi.querySelector('ul');
        
        if (parentLi.classList.contains('collapsed')) {
            // Expanding - load content on demand
            if (ul && nodeCache.has(parentLi)) {
                requestAnimationFrame(() => {
                    ul.innerHTML = nodeCache.get(parentLi);
                    addCollapsibleFunctionality();
                    updateVisibility();
                });
            }
        } else {
            // Collapsing - cache and clear content
            if (ul) {
                nodeCache.set(parentLi, ul.innerHTML);
                ul.innerHTML = '';
            }
        }
        
        parentLi.classList.toggle('collapsed');
    } finally {
        STATE.isProcessing = false;
    }
}

function saveVisibilityState(element) {
    element.querySelectorAll('[class]').forEach(el => {
        const key = el.getAttribute('data-node-id') || generateNodeId(el);
        STATE.lastVisibleState.set(key, {
            classes: el.className,
            display: el.style.display
        });
    });
}

function restoreVisibilityState(element) {
    element.querySelectorAll('[class]').forEach(el => {
        const key = el.getAttribute('data-node-id') || generateNodeId(el);
        const state = STATE.lastVisibleState.get(key);
        if (state) {
            el.className = state.classes;
            el.style.display = state.display;
        }
    });
}

function generateNodeId(element) {
    const id = 'node-' + Math.random().toString(36).substr(2, 9);
    element.setAttribute('data-node-id', id);
    return id;
}

function updateVisibility() {
    if (STATE.isProcessing) return;
    STATE.isProcessing = true;

    try {
        const elements = [
            { id: 'showTags', class: 'tag' },
            { id: 'showClasses', class: 'class' },
            { id: 'showIds', class: 'id' },
            { id: 'showContentSource', class: 'content-source' },
            { id: 'showStyleAppearance', class: 'style-appearance' },
            { id: 'showFormInput', class: 'form-input' },
            { id: 'showAccessibilityRoles', class: 'accessibility-roles' },
            { id: 'showMetadataRelationships', class: 'metadata-relationships' },
            { id: 'showMultimedia', class: 'multimedia' },
            { id: 'showScriptingBehavior', class: 'scripting-behavior' },
            { id: 'showImages', class: 'image-specific' },
            { id: 'showOthers', class: 'other-attributes' },
            { id: 'showInnerText', class: 'inner-content' }
        ];

        // Get visible elements first
        const visibleElements = getVisibleElements(document.getElementById('output'));
        
        // For collapsed elements, restore their content before updating visibility
        visibleElements.forEach(element => {
            if (element.classList.contains('collapsed')) {
                const ul = element.querySelector('ul');
                if (ul && nodeCache.has(element)) {
                    ul.innerHTML = nodeCache.get(element);
                    addCollapsibleFunctionality();
                }
            }
        });

        // Update visibility states
        requestAnimationFrame(() => {
            elements.forEach(({ id, class: className }) => {
                const show = document.getElementById(id)?.checked;
                visibleElements.forEach(elem => {
                    const elements = elem.querySelectorAll(`.${className}`);
                    elements.forEach(el => {
                        el.style.display = show ? '' : 'none';
                    });
                });
            });

            // Re-cache collapsed elements after visibility update
            visibleElements.forEach(element => {
                if (element.classList.contains('collapsed')) {
                    const ul = element.querySelector('ul');
                    if (ul) {
                        nodeCache.set(element, ul.innerHTML);
                        ul.innerHTML = '';
                    }
                }
            });

            STATE.isProcessing = false;
        });
    } catch (error) {
        console.error('Error in updateVisibility:', error);
        STATE.isProcessing = false;
    }
}

function getVisibleElements(container) {
    if (!container) return new Set();
    
    const containerRect = container.getBoundingClientRect();
    const elements = container.getElementsByTagName('li');
    const visibleElements = new Set();

    for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.top < containerRect.bottom + VIEWPORT_BUFFER && 
            rect.bottom > containerRect.top - VIEWPORT_BUFFER) {
            visibleElements.add(element);
        }
    }
    return visibleElements;
}

// Add scroll-based memory management
function initializeScrollManager() {
    const output = document.getElementById('output');
    if (!output) return;

    output.addEventListener('scroll', () => {
        if (STATE.scrollTimeout) {
            clearTimeout(STATE.scrollTimeout);
        }
        
        STATE.scrollTimeout = setTimeout(() => {
            const visibleElements = getVisibleElements(output);
            cleanupInvisibleElements(output, visibleElements);
        }, DEBOUNCE_DELAY);
    });
}

function cleanupInvisibleElements(container, visibleElements) {
    if (!container) return;
    
    const elements = container.getElementsByTagName('li');
    for (const element of elements) {
        if (!visibleElements.has(element) && !element.classList.contains('collapsed')) {
            const ul = element.querySelector('ul');
            if (ul && ul.innerHTML) {
                nodeCache.set(element, ul.innerHTML);
                ul.innerHTML = '';
            }
        }
    }
}

function cleanup() {
    STATE.isProcessing = false;
    STATE.lastVisibleState.clear();
    if (STATE.scrollTimeout) {
        clearTimeout(STATE.scrollTimeout);
    }
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML = '';
    }
}

// Initialize scroll management when visualizing
function visualize() {
    if (STATE.isProcessing) return;
    STATE.isProcessing = true;

    cleanup();
    
    try {
        const input = document.getElementById('input');
        const outputDiv = document.getElementById('output');
        
        if (!input?.value.trim() || !outputDiv) return;

        const rootNode = parseHTML(input.value);
        outputDiv.innerHTML = generateTreeHTML(rootNode);
        
        addCollapsibleFunctionality();
        initializeScrollManager();
        updateVisibility();
        
    } catch (error) {
        console.error("Visualization error:", error);
    } finally {
        STATE.isProcessing = false;
    }
}

// Event listeners for cleanup
window.addEventListener('beforeunload', cleanup);
window.addEventListener('visibilitychange', () => {
    if (document.hidden) cleanup();
});

// Add browser checks
if (!window.DOMParser) {
    console.error("Browser doesn't support DOMParser");
    // Fallback or error message
}