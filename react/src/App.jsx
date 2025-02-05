import { useState } from 'react'
import { VisibilityProvider } from './context/VisibilityContext.jsx'
import Header from './components/Header/Header'
import CodeInput from './components/CodeInput/CodeInput'
import Controls from './components/Controls/Controls'
import TreeView from './components/TreeView/TreeView'
import styles from './App.module.css'
import './styles/variables.css'

function App() {
  const [htmlContent, setHtmlContent] = useState('')
  const [visualizeContent, setVisualizeContent] = useState('')

  const handleVisualize = () => {
    setVisualizeContent(htmlContent)
  }

  return (
    <VisibilityProvider>
      <div className={styles.app}>
        <Header onVisualize={handleVisualize} />
        <div className={styles.container}>
          <CodeInput 
            value={htmlContent} 
            onChange={setHtmlContent} 
          />
          <Controls />
          <TreeView htmlContent={visualizeContent} />
        </div>
      </div>
    </VisibilityProvider>
  )
}

export default App
