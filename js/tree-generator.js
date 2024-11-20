function generateTreeHTML(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    let result = '<li>';
    const hasChildren = node.children.length > 0;
    const textContent = Array.from(node.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0)
        .join(' ');

    result += '<span class="collapsible">';

    result += `<span class="tag">${node.tagName.toLowerCase()}</span>`;
    
    if (node.className && typeof node.className === 'string') {
        const classes = node.className.split(' ').filter(c => c.trim() !== '');
        if (classes.length > 0) {
            result += '<span class="class">.' + classes.join('.') + '</span>';
        }
    }
    
    if (node.id) result += `<span class="id">#${node.id}</span>`;

    let attributeGroups = {
        'content-source': ['src', 'href', 'alt', 'title', 'target', 'rel', 'download', 'ping', 'media', 'poster', 'cite', 'data', 'action', 'formaction', 'icon', 'manifest', 'srcdoc', 'srcset', 'crossorigin', 'integrity', 'referrerpolicy'],
        'style-appearance': ['style', 'styles', 'width', 'height', 'align', 'valign', 'bgcolor', 'color', 'border', 'cellpadding', 'cellspacing', 'colspan', 'rowspan', 'size', 'face', 'shape', 'coords', 'background', 'margin', 'padding', 'font', 'font-family', 'font-size', 'font-weight', 'text-align', 'vertical-align', 'float', 'clear', 'display', 'position', 'z-index', 'opacity', 'stroke-opacity', 'popover', 'sizes', 'rows'],
        'form-input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly', 'checked', 'selected', 'max', 'min', 'maxlength', 'minlength', 'pattern', 'form', 'formmethod', 'formtarget', 'formnovalidate', 'autocomplete', 'method', 'enctype', 'accept', 'accept-charset', 'autocapitalize', 'autofocus', 'capture', 'inputmode', 'list', 'multiple', 'step', 'spellcheck', 'for'],
        'accessibility-roles': ['role', 'aria-*', 'tabindex', 'accesskey', 'lang', 'dir', 'hidden', 'contenteditable', 'draggable', 'dropzone', 'translate', 'for', 'action'],
        'metadata-relationships': ['data-*', 'itemscope', 'itemtype', 'itemprop', 'datetime', 'content', 'id', 'name', 'property', 'rev', 'about', 'resource', 'datatype', 'typeof', 'vocab', 'prefix', 'xmlns', 'xml:lang', 'xml:base', 'xml:space'],
        'multimedia': ['autoplay', 'controls', 'loop', 'muted', 'preload', 'playsinline', 'volume', 'currenttime', 'duration', 'buffered', 'played', 'seekable', 'ended', 'defaultmuted', 'defaultplaybackrate', 'disableremoteplayback', 'controlslist'],
        'scripting-behavior': ['onclick', 'onload', 'onsubmit', 'oninput', 'onchange', 'onkeydown', 'onkeyup', 'onmouseover', 'onmouseout', 'onblur', 'onfocus', 'ondrag', 'ondrop', 'onscroll', 'async', 'defer', 'nonce', 'onerror', 'onabort', 'onautocomplete', 'onautocompleteerror', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondurationchange', 'onemptied', 'onended', 'onformdata', 'oninput', 'oninvalid', 'onkeypress', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseup', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onsecuritypolicyviolation', 'onseeked', 'onseeking', 'onselect', 'onslotchange', 'onstalled', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onwheel'],
        'image-specific': ['d', 'viewBox', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y', 'dx', 'dy', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'z1', 'z2', 'transform', 'points', 'preserveAspectRatio', 'path', 'clip-path', 'mask', 'filter', 'vector-effect', 'pointer-events', 'stop-color', 'stop-opacity', 'text-anchor', 'dominant-baseline', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'fill-rule', 'clip-rule', 'enable-background', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'fx', 'fy', 'offset', 'patternUnits', 'patternTransform', 'marker-start', 'marker-mid', 'marker-end', 'mask-type', 'mask-units', 'primitiveUnits', 'xlink:href', 'area', 'img'],
        'other-attributes': []
    };

    for (let attr of node.attributes) {
        if (attr.name === 'class' || attr.name === 'id') continue;
        let grouped = false;
        for (let [group, attrs] of Object.entries(attributeGroups)) {
            if (attrs.includes(attr.name) || 
                (group === 'metadata-relationships' && attr.name.startsWith('data-')) ||
                (group === 'accessibility-roles' && attr.name.startsWith('aria-'))) {
                result += `<span class="${group}">[${attr.name}="${attr.value}"]</span>`;
                grouped = true;
                break;
            }
        }
        if (!grouped) {
            result += `<span class="other-attributes">[${attr.name}="${attr.value}"]</span>`;
        }
    }

    if (textContent) {
        result += ` <span class="inner-content">${textContent}</span>`;
    }

    result += '</span><ul>';
    
    if (hasChildren) {
        for (let child of node.children) {
            result += generateTreeHTML(child);
        }
    }
    
    result += '</ul></li>';
    return result;
}

function visualizeHTML(htmlString) {
    const rootNode = parseHTML(htmlString);
    return '<ul>' + generateTreeHTML(rootNode) + '</ul>';
}

function visualize() {
    try {
        const input = document.getElementById('input');
        const output = visualizeHTML(input.value);
        
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = output;
        
        addCollapsibleFunctionality();
        updateVisibility();
    } catch (error) {
        console.error("Error in visualization:", error);
        document.getElementById('output').innerHTML = '<p>An error occurred during visualization. Please check your input HTML.</p>';
    }
}