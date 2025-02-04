const attributeGroups = {
    'content-source': ['src', 'href', 'content', 'value', 'placeholder', 'action', 'data-src', 'srcset'],
    'style-appearance': ['style', 'rel', 'media', 'type', 'defer', 'async'],
    'form-input': ['name', 'required', 'pattern', 'min', 'max', 'step', 'readonly', 'disabled', 'checked', 'selected', 'for', 'form', 'formaction', 'formmethod'],
    'accessibility-roles': ['role', 'tabindex', 'title', 'alt', 'lang', 'hidden', 'aria-label', 'aria-describedby', 'aria-hidden'],
    'metadata-relationships': ['charset', 'name', 'property', 'itemprop', 'itemtype', 'data-testid'],
    'multimedia': ['controls', 'autoplay', 'loop', 'muted', 'preload', 'poster', 'kind', 'track'],
    'scripting-behavior': ['onclick', 'onsubmit', 'onload', 'onchange', 'oninput'],
    'image-specific': [
        'loading', 'srcset', 'sizes', 'crossorigin', 'decoding', 'referrerpolicy', 'fetchpriority',
        // SVG specific attributes
        'fill', 'viewBox', 'width', 'height', 'xmlns', 'd', 'stroke', 'stroke-width', 
        'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'points', 'transform',
        'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'path'
    ],
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

// Ultra-aggressive memory and render config
const MEMORY_CONFIG = {
    scrollDebounce: 25,        // Quick scroll response
    cleanupInterval: 250,      // Cleanup 4 times per second
    viewportBuffer: 200,       // Minimal viewport buffer
    maxCacheAge: 1000,        // Cache only for 1 second
    maxCachedNodes: 200,      // Severely limited cache
    chunkSize: 20,            // Smaller chunks
    emergencyThreshold: 0.4,   // Emergency cleanup at 40% memory usage
    reRenderInterval: 2000,    // Re-render visible content every 2 seconds
    maxMemoryUsage: 1.5 * 1024 * 1024 * 1024, // 1.5GB in bytes
    memoryCheckInterval: 100   // Check memory 10 times per second
};

// Dedicated memory monitor
const memoryMonitor = {
    interval: null,
    
    start() {
        this.stop(); // Clear any existing interval
        
        // Check memory usage frequently
        this.interval = setInterval(() => {
            this.checkMemory();
        }, MEMORY_CONFIG.memoryCheckInterval);
        
        // Also check on any user interaction
        document.addEventListener('click', () => this.checkMemory());
        document.addEventListener('scroll', () => this.checkMemory());
        document.addEventListener('keydown', () => this.checkMemory());
    },
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    checkMemory() {
        if (!window.performance?.memory) return;
        
        const memoryInfo = window.performance.memory;
        const usedMemory = memoryInfo.usedJSHeapSize;
        
        if (usedMemory > MEMORY_CONFIG.maxMemoryUsage) {
            console.warn(`Memory limit exceeded: ${Math.round(usedMemory / 1024 / 1024)}MB / 1.5GB`);
            this.forceCleanup();
        }
    },
    
    forceCleanup() {
        // Stop all processing
        STATE.isProcessing = true;
        
        try {
            // Clear all caches immediately
            STATE.nodeCache = new WeakMap();
            STATE.cacheTimestamps.clear();
            
            const output = document.getElementById('output');
            if (!output) return;
            
            // Keep only visible content
            const visibleElements = new Set(Array.from(getVisibleElements(output))
                .slice(0, 20)); // Keep only 20 elements
            
            // Remove everything else
            const elements = output.getElementsByTagName('li');
            while (elements.length > 0) {
                const element = elements[0];
                if (!visibleElements.has(element)) {
                    element.remove();
                } else if (elements[0] === element) {
                    // If we couldn't remove the element, break to prevent infinite loop
                    break;
                }
            }
            
            // Force garbage collection hint
            forceGarbageHint();
            
            // If still over limit, destroy everything
            if (window.performance.memory.usedJSHeapSize > MEMORY_CONFIG.maxMemoryUsage) {
                destroyAllContent('Memory limit still exceeded after cleanup');
            }
            
        } finally {
            STATE.isProcessing = false;
        }
    }
};

// Enhanced state management
const STATE = {
    isProcessing: false,
    scrollTimeout: null,
    cleanupInterval: null,
    lastCleanup: Date.now(),
    nodeCache: new WeakMap(),
    cacheTimestamps: new Map()
};

function escapeHTML(str) {
    return str.replace(/[<>"'`]/g, m => escapeMap[m]);
}

function getAttributeGroup(attrName) {
    const name = attrName.toLowerCase();
    
    // Special cases first
    if (name.startsWith('aria-')) {
        return 'accessibility-roles';
    }
    if (name.startsWith('on')) {
        return 'scripting-behavior';
    }
    if (name.startsWith('data-')) {
        return 'metadata-relationships';
    }
    
    // Check regular attribute groups
    for (const [group, attrs] of Object.entries(attributeGroups)) {
        if (attrs.includes(name)) {
            return group;
        }
    }
    
    return 'other-attributes';
}

function generateTreeHTML(node) {
    if (!node || node.nodeType !== ELEMENT_NODE) return '';

    try {
        const isBodyTag = node.tagName.toLowerCase() === 'body';
        const hasChildren = node.children.length > 0;
        const tagName = node.tagName.toLowerCase();
        
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

        // Process attributes with improved grouping
        const processedAttrs = new Map(); // Prevent duplicate attributes
        for (const attr of node.attributes) {
            if (attr.name !== 'class' && attr.name !== 'id') {
                const group = getAttributeGroup(attr.name);
                if (!processedAttrs.has(attr.name)) {
                    processedAttrs.set(attr.name, 
                        `<span class="${group}">[${attr.name}="${escapeHTML(attr.value)}"]</span>`);
                }
            }
        }
        parts.push(...processedAttrs.values());

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

function visualize() {
    if (STATE.isProcessing) return;
    STATE.isProcessing = true;

    cleanup(); // Reset state before starting
    
    try {
        const input = document.getElementById('input');
        const outputDiv = document.getElementById('output');
        
        if (!input?.value.trim() || !outputDiv) {
            STATE.isProcessing = false;
            return;
        }

        outputDiv.innerHTML = generateTreeHTML(parseHTML(input.value));
        
        addCollapsibleFunctionality();
        initializeScrollManager();
        startMemoryManager();
        updateVisibility();
        
    } catch (error) {
        console.error("Visualization error:", error);
    } finally {
        STATE.isProcessing = false;
    }
}

function startMemoryManager() {
    if (STATE.cleanupInterval) {
        clearInterval(STATE.cleanupInterval);
    }

    // Start memory monitor
    memoryMonitor.start();

    // Visibility change handlers
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            destroyAllContent('Tab hidden');
        } else {
            requestIdleCallback(() => reRenderVisibleContent());
        }
    });

    // Window focus handlers
    window.addEventListener('blur', () => {
        destroyAllContent('Window inactive');
    });

    window.addEventListener('focus', () => {
        requestIdleCallback(() => reRenderVisibleContent());
    });

    // Regular cleanup when active
    STATE.cleanupInterval = setInterval(() => {
        if (!document.hidden && !STATE.isProcessing) {
            performMemoryCleanup();
        }
    }, MEMORY_CONFIG.cleanupInterval);
}

function destroyAllContent(reason) {
    console.warn(`Destroying content: ${reason}`);
    
    // Stop all ongoing processes
    STATE.isProcessing = true;
    
    try {
        // Clear all intervals
        if (STATE.cleanupInterval) {
            clearInterval(STATE.cleanupInterval);
            STATE.cleanupInterval = null;
        }
        
        // Clear all caches and references
        STATE.nodeCache = new WeakMap();
        STATE.cacheTimestamps.clear();
        
        // Destroy DOM content
        const output = document.getElementById('output');
        if (output) {
            output.innerHTML = `<div class="placeholder">Content cleared - ${reason}</div>`;
        }
        
        // Force garbage collection hint
        forceGarbageHint();
        
    } finally {
        STATE.isProcessing = false;
    }
}

function reRenderVisibleContent() {
    const output = document.getElementById('output');
    if (!output || STATE.isProcessing || document.hidden) return;

    STATE.isProcessing = true;
    try {
        const placeholder = output.querySelector('.placeholder');
        if (placeholder) {
            // Re-visualize from scratch if we had destroyed the content
            visualize();
        } else {
            // Normal re-render of visible elements
            const visibleElements = getVisibleElements(output);
            visibleElements.forEach(element => {
                if (!element.classList.contains('collapsed')) {
                    const ul = element.querySelector('ul');
                    if (ul) {
                        const cachedContent = STATE.nodeCache.get(element);
                        if (cachedContent) {
                            ul.innerHTML = cachedContent;
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Re-render error:', error);
    } finally {
        STATE.isProcessing = false;
    }
}

function performMemoryCleanup() {
    if (STATE.isProcessing || document.hidden) return;
    
    if (window.performance?.memory?.usedJSHeapSize > MEMORY_CONFIG.maxMemoryUsage) {
        destroyAllContent('Memory limit exceeded');
        return;
    }
    
    // Regular cleanup only if active and under memory limit
    STATE.isProcessing = true;
    try {
        const output = document.getElementById('output');
        if (!output) return;

        const visibleElements = getVisibleElements(output);
        const elements = output.getElementsByTagName('li');
        
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            if (!visibleElements.has(element)) {
                element.remove();
            }
        }
        
        forceGarbageHint();
    } finally {
        STATE.isProcessing = false;
    }
}

function cleanup() {
    STATE.isProcessing = false;
    STATE.cacheTimestamps.clear();
    
    if (STATE.scrollTimeout) {
        clearTimeout(STATE.scrollTimeout);
    }
    if (STATE.cleanupInterval) {
        clearInterval(STATE.cleanupInterval);
    }
    
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML = '';
    }
}

// Event listeners for cleanup
window.addEventListener('beforeunload', cleanup);

// Add browser checks
if (!window.DOMParser) {
    console.error("Browser doesn't support DOMParser");
    // Fallback or error message
}