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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HTML Prism: Visualize and analyze HTML structure">
    <meta property="og:title" content="HTML Prism">
    <meta property="og:description" content="Visualize and analyze HTML structure with HTML Prism">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://html-prism.vercel.app/">
    <!-- <meta property="og:image" content="https://html-prism.vercel.app/logo.png"> -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
    <title>HTML Prism</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="site-header" role="banner">
        <nav aria-label="Main">
            <ul class="nav-menu" role="menubar">
                <li><a href="#structure" class="nav-link active" role="menuitem">Structure</a></li>
                <li><a href="#attributes" class="nav-link" role="menuitem">Attributes</a></li>
                <li><a href="#relationships" class="nav-link" role="menuitem">Relationships</a></li>
            </ul>
        </nav>
    </header>

    <main id="analyzer" role="main">
        <section class="code-view">
            <div class="code-panel" data-view="structure">
                <h1 class="panel-title" style="color: #333;">HTML Structure Analyzer</h1>
                <div class="code-display" aria-label="Code structure">
                    <pre><code class="language-html">
                        &lt;div class="example"&gt;
                            &lt;h1&gt;Title&lt;/h1&gt;
                            &lt;p&gt;Content&lt;/p&gt;
                        &lt;/div&gt;
                    </code></pre>
                </div>
            </div>
            
            <div class="analysis-panel" data-type="interactive">
                <form class="analysis-controls" onsubmit="analyzeStructure(event)">
                    <fieldset class="control-group">
                        <legend>Analysis Options</legend>
                        <select name="view-type" aria-label="View type" required>
                            <option value="tree">Tree View</option>
                            <option value="hierarchy">Hierarchy</option>
                            <option value="detailed">Detailed</option>
                        </select>
                        <input type="checkbox" 
                               id="show-attributes" 
                               name="attributes" 
                               checked
                               aria-label="Show attributes">
                        <label for="show-attributes">Show Attributes</label>
                    </fieldset>
                </form>

                <div class="visualization">
                    <img src="tree-view.svg" 
                         alt="HTML structure visualization" 
                         width="600" 
                         height="400"
                         loading="lazy">
                </div>
            </div>
        </section>

        <aside class="info-panel" role="complementary">
            <dl class="structure-info" aria-label="Structure information">
                <dt>Elements</dt>
                <dd>Analyze HTML tags and their relationships</dd>
                <dt>Attributes</dt>
                <dd>Inspect element properties and values</dd>
                <dt>Hierarchy</dt>
                <dd>Understand parent-child relationships</dd>
            </dl>
        </aside>
    </main>

    <footer class="site-footer" role="contentinfo">
        <p>Understand your HTML structure through visual analysis</p>
    </footer>
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