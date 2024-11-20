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
        { id: 'showOthers', class: 'other-attributes' }
    ];
    elements.forEach(el => {
        const show = document.getElementById(el.id).checked;
        document.querySelectorAll(`.${el.class}`).forEach(elem => {
            elem.style.display = show ? '' : 'none';
        });
    });
}

// Initial sample HTML
document.getElementById('input').value = `
<html>
<head>
    <title>DOM-Prism Demo</title>
    <meta name="description" content="Interactive DOM visualization">
    <style>
        .highlight { color: blue; }
        #special { display: none; }
    </style>
</head>
<body>
    <header class="main-header">
        <nav id="top-nav">
            <ul data-role="menu">
                <li class="active highlight">Home</li>
                <li hidden>About</li>
            </ul>
        </nav>
    </header>
    <main>
        <div id="special">Hidden content</div>
        <img src="logo.png" alt="Logo" width="100">
        <form>
            <input type="text" required>
        </form>
    </main>
</body>
</html>
`.trim();

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", message, "at", source, ":", lineno);
    alert("An error occurred. Please try again or contact support if the problem persists.");
    return true;
};