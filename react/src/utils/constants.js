export const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HTML Prism: A powerful tool for visualizing and analyzing HTML structure">
    <meta name="keywords" content="HTML, visualization, web development, debugging">
    <meta property="og:title" content="HTML Prism">
    <meta property="og:description" content="Visualize and analyze HTML structure with color-coded attribute categories">
    <meta property="og:type" content="website">
    <meta name="author" content="HTML Prism Team">
    <title>HTML Prism - HTML Structure Visualizer</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <script src="app.js" defer type="module"></script>
    <script async src="analytics.js" data-tracking="UA-XXXXX-Y"></script>
</head>
<body>
    <header class="main-header" role="banner">
        <nav id="main-nav" class="navigation" role="navigation" aria-label="Main navigation">
            <ul class="nav-list" data-menu="main">
                <li><a href="#features" onclick="navigate('features')" data-section="features" class="nav-link">Features</a></li>
                <li><a href="#docs" onclick="navigate('docs')" data-section="docs" class="nav-link active">Documentation</a></li>
            </ul>
        </nav>
    </header>

    <main id="content" role="main">
        <section class="hero" aria-labelledby="hero-title">
            <h1 id="hero-title">Welcome to HTML Prism</h1>
            <p class="lead">Visualize your HTML structure with color-coded attribute categories:</p>
            
            <div class="feature-grid" style="display: grid; gap: 1rem;">
                <div class="feature-card" data-feature="tags">
                    <h3>Tags <span class="tag-example">&lt;div&gt;</span></h3>
                    <p>HTML elements are shown in <span style="color: var(--color-tag)">blue</span></p>
                </div>
                
                <div class="feature-card" data-feature="classes">
                    <h3>Classes <span class="class-example">.className</span></h3>
                    <p>CSS classes are shown in <span style="color: var(--color-class)">green</span></p>
                </div>

                <div class="feature-card" data-feature="ids">
                    <h3>IDs <span class="id-example">#uniqueId</span></h3>
                    <p>Element IDs are shown in <span style="color: var(--color-id)">red</span></p>
                </div>
            </div>

            <img src="demo.jpg" alt="HTML Prism Interface" loading="lazy" width="1200" height="630"
                 srcset="demo-small.jpg 400w, demo-medium.jpg 800w, demo.jpg 1200w"
                 sizes="(max-width: 400px) 100vw, (max-width: 800px) 800px, 1200px">
        </section>

        <section class="examples" aria-labelledby="examples-title">
            <h2 id="examples-title">Interactive Examples</h2>
            
            <form id="demo-form" action="/api/submit" method="post" onsubmit="handleSubmit(event)" 
                  data-form="demo" autocomplete="off">
                <fieldset>
                    <legend>Form & Input Attributes</legend>
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required 
                               minlength="3" maxlength="20" pattern="[A-Za-z0-9]+"
                               placeholder="Enter username" autocomplete="username">
                        
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required 
                               placeholder="Enter email" autocomplete="email">
                        
                        <label for="preferences">Preferences:</label>
                        <select id="preferences" name="preferences" multiple 
                                aria-label="User preferences">
                            <option value="dark">Dark Mode</option>
                            <option value="notifications">Enable Notifications</option>
                        </select>
                    </div>
                </fieldset>
                
                <button type="submit" class="btn-primary" disabled 
                        aria-disabled="true" data-action="submit">
                    Submit
                </button>
            </form>

            <div class="multimedia-demo" aria-label="Multimedia examples">
                <video controls width="400" height="300" poster="poster.jpg"
                       preload="metadata">
                    <source src="demo.mp4" type="video/mp4">
                    <source src="demo.webm" type="video/webm">
                    <track kind="subtitles" src="captions.vtt" srclang="en" label="English">
                    Your browser doesn't support HTML5 video.
                </video>

                <audio controls preload="none">
                    <source src="audio.mp3" type="audio/mpeg">
                    <source src="audio.ogg" type="audio/ogg">
                    Your browser doesn't support HTML5 audio.
                </audio>
            </div>
        </section>

        <aside class="sidebar" role="complementary">
            <div class="widget" data-widget-type="info">
                <h2>Attribute Categories</h2>
                <ul class="category-list">
                    <li>Content & Source [src, href, content]</li>
                    <li>Styling & Appearance [style, class]</li>
                    <li>Form & Input [required, pattern]</li>
                    <li>Accessibility & Roles [role, aria-*]</li>
                    <li>Metadata & Relationships [data-*]</li>
                    <li>Scripting & Behavior [onclick, defer]</li>
                    <li>Multimedia [controls, autoplay]</li>
                    <li>Image-specific [loading, srcset]</li>
                </ul>
            </div>
        </aside>
    </main>

    <footer class="site-footer" role="contentinfo">
        <div class="footer-content">
            <p>&copy; 2024 HTML Prism. All rights reserved.</p>
            <nav class="footer-nav" aria-label="Footer navigation">
                <a href="/privacy" rel="noopener">Privacy Policy</a>
                <a href="/terms" rel="noopener">Terms of Service</a>
                <a href="https://github.com/html-prism" rel="noopener external"
                   target="_blank">GitHub</a>
            </nav>
        </div>
        <script>
            // Footer initialization
            document.addEventListener('DOMContentLoaded', () => {
                console.log('Footer initialized');
            });
        </script>
    </footer>
</body>
</html>
`.trim();

export const attributeGroups = {
  'content-source': [
    'src', 'href', 'content', 'value', 'placeholder', 'action', 
    'data-src', 'srcset', 'formaction', 'cite', 'poster',
    'type',
  ],
  'style-appearance': [
    'style', 'class', 'rel', 'media', 'display',
    'align', 'valign', 'bgcolor', 'color', 'border', 'background',
    'hidden'
  ],
  'form-input': [
    'name', 'required', 'pattern', 'min', 'max', 'step', 'readonly',
    'disabled', 'checked', 'selected', 'for', 'form', 'formmethod',
    'maxlength', 'minlength', 'multiple', 'autofocus', 'autocomplete',
    'type'
  ],
  'accessibility-roles': [
    'role', 'tabindex', 'title', 'alt', 'lang', 'aria-label',
    'aria-describedby', 'aria-hidden', 'aria-live', 'aria-atomic',
    'accesskey', 'draggable'
  ],
  'metadata-relationships': [
    'charset', 'name', 'property', 'itemprop', 'itemtype',
    'http-equiv', 'scheme', 'about', 'rev', 'xmlns', 'version',
    'id'
  ],
  'multimedia': [
    'controls', 'autoplay', 'loop', 'muted', 'preload', 'kind',
    'track', 'buffered', 'volume', 'playsinline'
  ],
  'scripting-behavior': [
    'defer', 'async', 'nomodule', 'nonce', 'integrity',
    'importance', 'blocking', 'fetchpriority',
    'onclick', 'onsubmit', 'onload', 'onchange', 'oninput'
  ],
  'image-specific': [
    'loading', 'srcset', 'sizes', 'width', 'height', 'decoding',
    'referrerpolicy', 'fetchpriority', 'crossorigin', 'ismap', 'usemap',
    'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'points',
    'transform', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry'
  ],
  'other-attributes': []
};

// Form input types - to help categorize 'type' attribute correctly
export const formInputTypes = [
  'text', 'password', 'checkbox', 'radio', 'submit', 'reset', 'file', 
  'hidden', 'image', 'button', 'email', 'url', 'number', 'range', 
  'search', 'tel', 'date', 'time', 'datetime-local', 'month', 'week', 
  'color'
];

// Content type elements - elements where 'type' indicates content type
export const contentTypeElements = ['script', 'style', 'link', 'source', 'object', 'embed'];

// Special handling for script and style tags
export const scriptAttributes = ['type', 'src', 'async', 'defer', 'crossorigin', 'integrity'];
export const styleAttributes = ['media', 'type'];

// Visibility configuration
export const VISIBILITY_CONFIG = [
  { id: 'showTags', label: 'Tags', class: 'tag' },
  { id: 'showClasses', label: 'Classes', class: 'class' },
  { id: 'showIds', label: 'IDs', class: 'id' },
  { id: 'showContentSource', label: 'Content & Source', class: 'content-source' },
  { id: 'showStyleAppearance', label: 'Styling & Appearance', class: 'style-appearance' },
  { id: 'showFormInput', label: 'Form & Input', class: 'form-input' },
  { id: 'showAccessibilityRoles', label: 'Accessibility & Roles', class: 'accessibility-roles' },
  { id: 'showMetadataRelationships', label: 'Metadata & Relationships', class: 'metadata-relationships' },
  { id: 'showMultimedia', label: 'Multimedia', class: 'multimedia' },
  { id: 'showScriptingBehavior', label: 'Scripting & Behavior', class: 'scripting-behavior' },
  { id: 'showImages', label: 'Images', class: 'image-specific' },
  { id: 'showOthers', label: 'Others', class: 'other-attributes' },
  { id: 'showInnerText', label: 'Inner Text', class: 'inner-content' }
]; 