import { useState } from 'react';
import { useVisibility } from './context/VisibilityContext.jsx';
import Header from './components/Header/Header';
import CodeInput from './components/CodeInput/CodeInput';
import Controls from './components/Controls/Controls';
import TreeView from './components/TreeView/TreeView';
import styles from './App.module.css';
import './styles/variables.css';
import { VisibilityProvider } from './context/VisibilityContext.jsx';

function AppContent() {
  // State for managing HTML input and visualization content
  // visualizeContent is only updated when the user clicks "Visualize" to prevent constant re-renders
  const [htmlContent, setHtmlContent] = useState('');
  const [visualizeContent, setVisualizeContent] = useState('');
  const { visibility } = useVisibility();

  // Updates visualization content on-demand, triggered by user action
  const handleVisualize = () => {
    setVisualizeContent(htmlContent);
  }

  return (
    <div className={styles.app}>
      <Header onVisualize={handleVisualize} />
      <div className={styles.container}>
        {/* Conditionally render the left panel */}
        {visibility.showInputControls && (
          <div className={styles.leftPanel}>
            <CodeInput 
              value={htmlContent} 
              onChange={setHtmlContent} 
            />
            <Controls />
          </div>
        )}
        {/* Right panel displays the HTML tree visualization */}
        <div className={styles.rightPanel}>
          <TreeView htmlContent={visualizeContent} />
        </div>
      </div>
    </div>
  );
}

// Wrapper component that provides the visibility context
function App() {
  return (
    <VisibilityProvider>
      <AppContent />
    </VisibilityProvider>
  );
}

export default App;
