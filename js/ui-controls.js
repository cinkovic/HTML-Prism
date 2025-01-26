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

// Sample HTML with proper attribute categorization
const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HTML Prism: Visualize and analyze HTML structure">
    <title>HTML Structure Visualizer</title>
    <link rel="stylesheet" href="styles.css">
    <script src="app.js" defer type="module"></script>
</head>
<body>
    <header class="main-header" role="banner">
        <nav id="main-nav" class="navigation" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
                <li><a href="#home" onclick="navigate('home')" data-section="home">Home</a></li>
                <li><a href="#about" onclick="navigate('about')" data-section="about">About</a></li>
            </ul>
        </nav>
    </header>

    <main id="content" role="main">
        <section class="hero" aria-labelledby="hero-title">
            <h1 id="hero-title">Welcome to HTML Visualizer</h1>
            <img src="hero.jpg" alt="HTML Structure Visualization" loading="lazy" width="800" height="400">
            
            <form id="contact-form" action="/submit" method="post" onsubmit="handleSubmit(event)">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required placeholder="Enter your name">
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required placeholder="Enter your email">
                
                <button type="submit" class="btn-primary" disabled>Submit</button>
            </form>
        </section>

        <aside class="sidebar" role="complementary">
            <div class="widget" data-widget-type="info">
                <h2>Quick Info</h2>
                <p>This example demonstrates various HTML elements and their attributes.</p>
            </div>
        </aside>
    </main>

    <footer class="site-footer" role="contentinfo">
        <p>&copy; 2024 HTML Visualizer. All rights reserved.</p>
        <script>
            console.log('Footer script');
        </script>
    </footer>
</body>
</html>
`.trim();

// Set the sample HTML when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    if (input && !input.value.trim()) {
        input.value = SAMPLE_HTML;
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