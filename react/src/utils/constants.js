export const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
</head>
<body>
    <header>
        <h1>Welcome to HTML Prism</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="content">
            <h2 id="main-title">Main Content</h2>
            <p>This is a sample HTML structure.</p>
        </section>
    </main>
</body>
</html>
`.trim();

export const VISIBILITY_CONFIG = [
  { id: 'showTags', label: 'Tags', class: 'tag' },
  { id: 'showClasses', label: 'Classes', class: 'class' },
  { id: 'showIds', label: 'IDs', class: 'id' },
  { id: 'showContentSource', label: 'Content & Source', class: 'content-source' },
  { id: 'showStyleAppearance', label: 'Styling & Appearance', class: 'style-appearance' },
  { id: 'showFormInput', label: 'Form & Input', class: 'form-input' },
  { id: 'showAccessibilityRoles', label: 'Accessibility & Roles', class: 'accessibility-roles' },
  { id: 'showMetadataRelationships', label: 'Metadata & Relationships', class: 'metadata-relationships' },
  { id: 'showScriptingBehavior', label: 'Scripting & Behavior', class: 'scripting-behavior' },
  { id: 'showImages', label: 'Images', class: 'image-specific' },
  { id: 'showMultimedia', label: 'Multimedia', class: 'multimedia' },
  { id: 'showOthers', label: 'Others', class: 'other-attributes' },
  { id: 'showInnerText', label: 'Inner Text', class: 'inner-content' }
]; 