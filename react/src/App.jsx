import { useState } from 'react'
import { VisibilityProvider } from './context/VisibilityContext.jsx'
import Header from './components/Header/Header'
import CodeInput from './components/CodeInput/CodeInput'
import Controls from './components/Controls/Controls'
import TreeView from './components/TreeView/TreeView'
import styles from './App.module.css'
import './styles/variables.css'

function App() {
  // State for managing HTML input and visualization content
  // visualizeContent is only updated when the user clicks "Visualize" to prevent constant re-renders
  const [htmlContent, setHtmlContent] = useState('')
  const [visualizeContent, setVisualizeContent] = useState('')

  // Updates visualization content on-demand, triggered by user action
  const handleVisualize = () => {
    setVisualizeContent(htmlContent)
  }

  return (
    <VisibilityProvider>
      <div className={styles.app}>
        <Header onVisualize={handleVisualize} />
        <div className={styles.container}>
          {/* Left panel contains input area and visibility controls */}
          <div className={styles.leftPanel}>
            <CodeInput 
              value={htmlContent} 
              onChange={setHtmlContent} 
            />
            <Controls />
          </div>
          {/* Right panel displays the HTML tree visualization */}
          <div className={styles.rightPanel}>
            <TreeView htmlContent={visualizeContent} />
          </div>
        </div>
      </div>
    </VisibilityProvider>
  )
}

export default App
