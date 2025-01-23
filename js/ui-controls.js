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
    elements.forEach(el => {
        const show = document.getElementById(el.id).checked;
        document.querySelectorAll(`.${el.class}`).forEach(elem => {
            elem.style.display = show ? '' : 'none';
        });
    });
}

// Sample HTML
document.getElementById('input').value = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" class="metadata-relationships">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" class="metadata-relationships">
    <meta name="description" content="HTML Prism - A powerful tool for visualizing and analyzing HTML structure" class="metadata-relationships">
    <title>HTML Prism - HTML Structure Visualization Tool</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/analyzer.js" defer class="scripting-behavior"></script>
</head>
<body>
    <nav id="mainNav" class="main-navigation" role="navigation" class="accessibility-roles">
        <ul class="nav-list" role="menubar" class="accessibility-roles">
            <li><a href="#features" class="active inner-content">Key Features</a></li>
            <li><a href="#how-it-works" class="inner-content">How It Works</a></li>
            <li><a href="#docs" class="inner-content">Documentation</a></li>
        </ul>
    </nav>

    <main id="analyzer">
        <section class="hero-section">
            <h1 class="main-title inner-content">Visualize Your HTML Structure</h1>
            <p class="lead-text inner-content">Transform complex HTML into clear, interactive tree diagrams. Perfect for developers, designers, and educators.</p>
        </section>

        <section class="features">
            <h2 class="inner-content">Why Use HTML Prism?</h2>
            <ul class="feature-list">
                <li class="inner-content">Instantly visualize HTML structure and hierarchy</li>
                <li class="inner-content">Identify and analyze HTML elements by category</li>
                <li class="inner-content">Debug layout and structure issues efficiently</li>
                <li class="inner-content">Perfect for learning and teaching HTML concepts</li>
            </ul>
        </section>

        <section class="interactive-demo">
            <h2 class="inner-content">Try It Yourself</h2>
            <div class="demo-container">
                <form id="analyzeForm" class="form-input">
                    <label for="htmlInput" class="inner-content">Paste your HTML in top window and hit 'Visualize'</label>
                    <textarea 
                        id="htmlInput" 
                        name="html" 
                        required 
                        class="form-input"
                        placeholder="Enter your HTML code here to see it transformed into a visual tree structure..."
                        aria-label="HTML input area" 
                        class="accessibility-roles">
                    </textarea>
                    <button type="submit" class="form-input inner-content">Analyze Structure</button>
                </form>
            </div>
        </section>

        <section class="example-section">
            <h2 class="inner-content">See How It Works</h2>
            <div class="code-preview" style="background: #f5f5f5; padding: 1rem;" class="style-appearance">
                <nav class="tag">
                    <ul class="class tag">
                        <li class="tag" onclick="showExample()" class="scripting-behavior">
                            <a href="#" class="tag inner-content">Interactive Example</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    </main>

    <div class="controls">
        <div class="visibility-toggles">
            <label><input type="checkbox" id="showTags" checked> Tags</label>
            <label><input type="checkbox" id="showClasses" checked> Classes</label>
            <label><input type="checkbox" id="showIds" checked> IDs</label>
            <label><input type="checkbox" id="showContentSource" checked> Content</label>
            <label><input type="checkbox" id="showStyleAppearance" checked> Styles</label>
            <label><input type="checkbox" id="showFormInput" checked> Forms</label>
            <label><input type="checkbox" id="showAccessibilityRoles" checked> Accessibility</label>
            <label><input type="checkbox" id="showMetadataRelationships" checked> Metadata</label>
            <label><input type="checkbox" id="showMultimedia" checked> Multimedia</label>
            <label><input type="checkbox" id="showScriptingBehavior" checked> Scripting</label>
            <label><input type="checkbox" id="showImages" checked> Images</label>
            <label><input type="checkbox" id="showOthers" checked> Other</label>
            <label><input type="checkbox" id="showInnerText" checked> Inner Text</label>
        </div>
    </div>
</body>
</html>
`.trim();

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