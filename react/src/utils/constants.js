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
  { id: 'showContentSource', label: 'Content & Source', class: 'contentsource' },
  { id: 'showStyleAppearance', label: 'Styling & Appearance', class: 'styleappearance' },
  { id: 'showFormInput', label: 'Form & Input', class: 'forminput' },
  { id: 'showAccessibilityRoles', label: 'Accessibility & Roles', class: 'accessibilityroles' },
  { id: 'showMetadataRelationships', label: 'Metadata & Relationships', class: 'metadatarelationships' },
  { id: 'showScriptingBehavior', label: 'Scripting & Behavior', class: 'scriptingbehavior' },
  { id: 'showImages', label: 'Images', class: 'imagespecific' },
  { id: 'showMultimedia', label: 'Multimedia', class: 'multimedia' },
  { id: 'showOthers', label: 'Others', class: 'otherattributes' },
  { id: 'showInnerText', label: 'Inner Text', class: 'innercontent' }
]; 