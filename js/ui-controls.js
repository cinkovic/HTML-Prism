function addCollapsibleFunctionality() {
    document.querySelectorAll('.collapsible').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            this.parentElement.classList.toggle('collapsed');
        });
    });
}

function updateVisibility() {
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

    // Cache DOM queries
    const displayUpdates = elements.map(el => ({
        show: document.getElementById(el.id)?.checked,
        elements: document.querySelectorAll(`.${el.class}`)
    }));

    // Batch DOM updates
    requestAnimationFrame(() => {
        displayUpdates.forEach(update => {
            update.elements.forEach(elem => {
                elem.style.display = update.show ? '' : 'none';
            });
        });
    });
}

// Move sample HTML to a separate constant or remove it if not needed
const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en" class="metadata-relationships">
<head>
    <meta charset="UTF-8" class="metadata-relationships">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" class="metadata-relationships">
    <meta name="description" content="HTML Prism reveals the structure and relationships in your HTML through visual analysis" class="metadata-relationships">
    <meta name="keywords" content="HTML analysis, semantic structure, element relationships, web architecture" class="metadata-relationships">
    <meta property="og:title" content="HTML Prism - Understand HTML Structure" class="metadata-relationships">
    <meta property="og:image" content="prism-preview.png" class="metadata-relationships image-specific">
    <title class="metadata-relationships">HTML Prism - Visualize HTML Architecture</title>
    <link rel="stylesheet" href="prism.css" class="metadata-relationships style-appearance">
    <script src="prism.js" defer class="scripting-behavior"></script>
</head>
<body>
    <header class="document-header style-appearance">
        <img src="prism-logo.svg" 
             alt="HTML Prism" 
             class="image-specific"
             width="120" 
             height="40">
        <nav id="main-nav" class="accessibility-roles" role="navigation">
            <ul class="nav-structure" role="menubar">
                <li><a href="#input" class="action-analyze scripting-behavior">Analyze HTML</a></li>
                <li><a href="#output" class="action-visualize scripting-behavior">View Structure</a></li>
                <li><a href="#help" class="action-learn scripting-behavior">Learn Patterns</a></li>
            </ul>
        </nav>
    </header>

    <main id="workspace">
        <section id="input" class="html-input">
            <h1 class="input-heading inner-content">Analyze Your HTML</h1>
            <p class="input-guide content-source">Input HTML to reveal its structural patterns and element relationships</p>
            
            <form id="html-form" class="form-input" onsubmit="return processHTML(event)">
                <label for="code-input" class="form-input accessibility-roles">Enter HTML Code:</label>
                <textarea 
                    id="code-input" 
                    name="html" 
                    required 
                    class="form-input"
                    placeholder="Paste HTML to analyze its structure..."
                    aria-label="HTML code entry">
                </textarea>
                <button type="submit" class="form-submit form-input scripting-behavior">Reveal Structure</button>
            </form>
        </section>

        <section id="output" class="html-output">
            <h2 class="output-heading inner-content">Structure Visualization</h2>
            <div class="output-display">
                <picture class="visual-output multimedia">
                    <source srcset="structure-dark.webp" media="(prefers-color-scheme: dark)" class="image-specific">
                    <source srcset="structure-light.webp" class="image-specific">
                    <img src="structure.png" 
                         alt="HTML structure diagram" 
                         class="image-specific"
                         width="800" 
                         height="400"
                         loading="lazy">
                </picture>
                <div class="view-controls">
                    <h3 class="control-heading inner-content">Structure View</h3>
                    <div class="control-options" role="group">
                        <label class="form-input">
                            <input type="checkbox" 
                                   name="show-elements" 
                                   checked 
                                   class="form-input"
                                   aria-describedby="view-help">
                            Show Elements
                        </label>
                        <p id="view-help" class="view-guide content-source accessibility-roles">Control element visibility in the structure view</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="help" class="html-guide">
            <h2 class="guide-heading inner-content">HTML Structure Guide</h2>
            <div class="guide-content">
                <article class="pattern-guide" role="article">
                    <h3 class="pattern-heading inner-content">Common HTML Patterns</h3>
                    <ul class="pattern-list">
                        <li class="pattern-item content-source">Document Flow: How elements create hierarchy</li>
                        <li class="pattern-item content-source">Element Relationships: Parent, child, and sibling connections</li>
                        <li class="pattern-item content-source">Semantic Structure: Meaningful HTML organization</li>
                        <li class="pattern-item content-source">Content Architecture: Building clear document outlines</li>
                    </ul>
                </article>
            </div>
        </section>
    </main>

    <footer class="document-footer">
        <nav class="help-links accessibility-roles" role="navigation">
            <a href="/guide" rel="help" class="link-guide metadata-relationships scripting-behavior">Usage Guide</a>
            <a href="/patterns" rel="help" class="link-patterns metadata-relationships scripting-behavior">HTML Patterns</a>
        </nav>
        <p class="footer-note content-source">HTML Prism - Understand your document structure</p>
    </footer>
</body>
</html>
`.trim();

// Set the sample HTML only once when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    if (input && !input.value.trim()) {
        input.value = SAMPLE_HTML;
        // Removed the automatic visualization
    }
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", message, "at", source, ":", lineno);
    alert("An error occurred. Please try again or contact support if the problem persists.");
    return true;
};

function parseHTML(htmlString) {
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