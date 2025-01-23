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
<html lang="en" dir="ltr" itemscope itemtype="http://schema.org/WebApplication">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HTML Prism: Advanced HTML Structure Visualization and Analysis Tool">
    <meta property="og:title" content="HTML Prism - HTML Analysis Tool">
    <meta property="og:description" content="Professional HTML structure visualization and analysis tool">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://html-prism.vercel.app/og-image.png">
    
    <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/css/main.min.css">
    <script src="/js/critical.min.js" defer></script>
    
    <title>HTML Prism - HTML Structure Analysis Tool</title>
</head>
<body class="theme-light" data-analytics="enabled">
    <a href="#main" class="skip-link">Skip to main content</a>
    
    <header class="site-header">
        <div class="container">
            <nav class="main-nav">
                <a href="/" class="logo-link">
                    <img src="/img/logo.svg" alt="HTML Prism" width="120" height="32">
                </a>
                
                <ul class="nav-list">
                    <li><a href="/features" class="nav-item">Features</a></li>
                    <li><a href="/docs" class="nav-item">Docs</a></li>
                    <li><a href="/examples" class="nav-item">Examples</a></li>
                </ul>

                <div class="nav-controls">
                    <button type="button" class="theme-toggle" aria-label="Toggle theme">
                        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
                            <use href="#icon-moon"/>
                        </svg>
                    </button>
                    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu">
                        <span class="sr-only">Menu</span>
                        <span class="hamburger"></span>
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <main id="main">
        <div class="hero">
            <div class="container">
                <h1 class="hero-title">Visualize Your HTML Structure</h1>
                <p class="hero-subtitle">Transform complex HTML into clear, interactive visualizations</p>
                
                <div class="demo-preview">
                    <div class="demo-video-wrapper">
                        <video 
                            class="demo-video" 
                            poster="/img/demo-poster.webp"
                            playsinline
                            muted
                            loop>
                            <source src="/video/demo.webm" type="video/webm">
                            <source src="/video/demo.mp4" type="video/mp4">
                        </video>
                        <button type="button" class="play-button" aria-label="Play demo video">
                            <svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <section class="features" aria-labelledby="features-title">
            <div class="container">
                <h2 id="features-title" class="section-title">Key Features</h2>
                
                <div class="feature-grid">
                    <article class="feature-card">
                        <div class="feature-icon">
                            <svg aria-hidden="true"><use href="#icon-tree"/></svg>
                        </div>
                        <h3 class="feature-title">DOM Tree Visualization</h3>
                        <p class="feature-desc">Interactive tree view with expandable nodes</p>
                    </article>
                    
                    <article class="feature-card">
                        <div class="feature-icon">
                            <svg aria-hidden="true"><use href="#icon-check"/></svg>
                        </div>
                        <h3 class="feature-title">Accessibility Checker</h3>
                        <p class="feature-desc">Identify and fix accessibility issues</p>
                    </article>
                    
                    <article class="feature-card">
                        <div class="feature-icon">
                            <svg aria-hidden="true"><use href="#icon-speed"/></svg>
                        </div>
                        <h3 class="feature-title">Performance Analysis</h3>
                        <p class="feature-desc">Get optimization recommendations</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="live-demo" aria-labelledby="demo-title">
            <div class="container">
                <h2 id="demo-title" class="section-title">Try It Live</h2>
                
                <div class="demo-container">
                    <div class="demo-controls">
                        <form class="demo-form" data-form="analysis">
                            <div class="form-group">
                                <label for="viewMode" class="form-label">View Mode</label>
                                <select id="viewMode" class="form-select" required>
                                    <option value="tree">Tree View</option>
                                    <option value="blueprint">Blueprint</option>
                                    <option value="3d">3D Structure</option>
                                </select>
                            </div>

                            <fieldset class="form-group">
                                <legend class="form-label">Display Options</legend>
                                <label class="checkbox">
                                    <input type="checkbox" name="showMetadata" checked>
                                    <span>Show Metadata</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="showA11y" checked>
                                    <span>Show Accessibility Info</span>
                                </label>
                            </fieldset>
                        </form>
                    </div>

                    <div class="demo-preview">
                        <div class="demo-frame">
                            <iframe 
                                title="HTML Prism Live Demo"
                                src="/demo/playground"
                                loading="lazy"
                                class="demo-iframe">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <p class="copyright">&copy; 2024 HTML Prism</p>
                <nav class="footer-nav">
                    <ul class="footer-links">
                        <li><a href="/privacy">Privacy</a></li>
                        <li><a href="/terms">Terms</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </footer>

    <svg class="sprite" aria-hidden="true" style="display: none">
        <symbol id="icon-moon" viewBox="0 0 24 24">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
        </symbol>
        <symbol id="icon-play" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
        </symbol>
        <!-- Other icons... -->
    </svg>
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