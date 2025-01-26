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

// Constants for chunking
const CHUNK_SIZE = 100; // Number of nodes to process at once
const RENDER_DELAY = 10; // ms between chunks
const MAX_VISIBLE_NODES = 1000; // Maximum nodes to show at once

// Constants for state management
const nodeCache = new WeakMap();
const STATE = {
    isProcessing: false,
    lastVisibleState: new Map() // Track visibility state of elements
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
        // Check if element is root level (direct child of body or html)
        const isRootElement = !node.parentElement || 
            node.parentElement.tagName === 'BODY' || 
            node.parentElement.tagName === 'HTML' ||
            node.parentElement.tagName === '#document-fragment';
        
        // Different structure for root elements
        const parts = isRootElement ? ['<li style="list-style: none;">'] : ['<li>'];
        const hasChildren = node.children.length > 0;
        const tagName = node.tagName.toLowerCase();
        
        parts.push(
            `<span class="collapsible${hasChildren ? '' : ' no-arrow'}">`,
            `<span class="tag">${tagName}</span>`
        );

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
        for (const attr of node.attributes) {
            if (attr.name !== 'class' && attr.name !== 'id') {
                const group = getAttributeGroup(attr.name);
                parts.push(`<span class="${group}">[${attr.name}="${escapeHTML(attr.value)}"]</span>`);
            }
        }

        // Handle special content
        if (tagName === 'script' && node.textContent.trim()) {
            parts.push(` <span class="scripting-behavior">${escapeHTML(node.textContent.trim())}</span>`);
        } else if (tagName === 'style' && node.textContent.trim()) {
            parts.push(` <span class="style-appearance">${escapeHTML(node.textContent.trim())}</span>`);
        } else if (node.childNodes) {
            const textNodes = Array.from(node.childNodes)
                .filter(node => node.nodeType === TEXT_NODE && node.textContent.trim())
                .map(node => node.textContent.trim());
            
            if (textNodes.length) {
                parts.push(` <span class="inner-content">${escapeHTML(textNodes.join(' '))}</span>`);
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

async function processChunks(nodes, outputDiv) {
    const totalChunks = Math.ceil(nodes.length / CHUNK_SIZE);
    let html = '';

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, nodes.length);
        const chunk = nodes.slice(start, end);

        // Process chunk
        const chunkHTML = chunk.map(node => generateTreeHTML(node)).join('');
        html += chunkHTML;

        // Render progress every few chunks
        if (i % 5 === 0) {
            outputDiv.innerHTML = html;
            await new Promise(resolve => setTimeout(resolve, RENDER_DELAY));
        }

        // Clear references to help GC
        chunk.length = 0;
    }

    // Final render
    outputDiv.innerHTML = html;
}

async function visualize() {
    if (STATE.isProcessing) return;
    STATE.isProcessing = true;

    cleanup();

    try {
        const input = document.getElementById('input');
        const outputDiv = document.getElementById('output');
        
        if (!input?.value.trim() || !outputDiv) {
            throw new Error("Missing required elements");
        }

        outputDiv.innerHTML = '<div class="loading">Processing...</div>';
        
        const rootNode = parseHTML(input.value);
        const nodes = Array.from(rootNode.children);
        
        await processChunks(nodes, outputDiv);
        
        addCollapsibleFunctionality();
        addScrollMemoryManagement(); // Add scroll management
        updateVisibility();
        
    } catch (error) {
        console.error("Visualization error:", error);
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    } finally {
        STATE.isProcessing = false;
    }
}

function cleanup() {
    STATE.isProcessing = false;
    STATE.lastVisibleState.clear();
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML = '';
        output.textContent = ''; // Additional cleanup
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

        requestAnimationFrame(() => {
            elements.forEach(({ id, class: className }) => {
                const show = document.getElementById(id)?.checked;
                document.querySelectorAll(`:not(.collapsed) .${className}`).forEach(elem => {
                    elem.style.display = show ? '' : 'none';
                });
            });
            STATE.isProcessing = false;
        });
    } catch (error) {
        console.error('Error in updateVisibility:', error);
        STATE.isProcessing = false;
    }
}

function addCollapsibleFunctionality() {
    document.querySelectorAll('.collapsible').forEach(item => {
        item.removeEventListener('click', handleCollapse); // Remove old listeners
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
            // Expanding
            if (ul && nodeCache.has(parentLi)) {
                ul.innerHTML = nodeCache.get(parentLi);
                addCollapsibleFunctionality();
                restoreVisibilityState(ul);
            }
        } else {
            // Collapsing
            if (ul) {
                saveVisibilityState(ul);
                nodeCache.set(parentLi, ul.innerHTML);
                ul.innerHTML = '';
            }
        }
        
        parentLi.classList.toggle('collapsed');
    } catch (error) {
        console.error('Error in collapse handler:', error);
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

// Add scroll-based memory management
function addScrollMemoryManagement() {
    const output = document.getElementById('output');
    if (!output) return;

    let scrollTimeout;
    output.addEventListener('scroll', () => {
        // Clear previous timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Set new timeout to cleanup after scrolling stops
        scrollTimeout = setTimeout(() => {
            const visibleElements = getVisibleElements(output);
            cleanupInvisibleElements(output, visibleElements);
        }, 150); // Wait for scroll to finish
    });
}

function getVisibleElements(container) {
    const containerRect = container.getBoundingClientRect();
    const elements = container.getElementsByTagName('li');
    const visibleElements = new Set();

    for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
            visibleElements.add(element);
            // Add some elements above and below viewport for smooth scrolling
            let prev = element.previousElementSibling;
            let next = element.nextElementSibling;
            for (let i = 0; i < 10; i++) {
                if (prev) {
                    visibleElements.add(prev);
                    prev = prev.previousElementSibling;
                }
                if (next) {
                    visibleElements.add(next);
                    next = next.nextElementSibling;
                }
            }
        }
    }
    return visibleElements;
}

function cleanupInvisibleElements(container, visibleElements) {
    const elements = container.getElementsByTagName('li');
    for (const element of elements) {
        if (!visibleElements.has(element)) {
            const ul = element.querySelector('ul');
            if (ul) {
                ul.innerHTML = ''; // Clear children of invisible elements
            }
        }
    }
}