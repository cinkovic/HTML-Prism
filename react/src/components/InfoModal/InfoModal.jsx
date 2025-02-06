import { useEffect, useRef } from 'react';
import styles from './InfoModal.module.css';
import { attributeGroups } from '../../utils/constants';

export default function InfoModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatCategoryName = (name) => 
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <h3>To use HTML Prism:</h3>
        <ul>
          <li>Paste your HTML code into the input area</li>
          <li>Click "Visualize" to analyze your HTML</li>
          <li>Use the checkboxes to toggle different attribute categories</li>
          <li>Click on elements to collapse/expand their children</li>
          <li>Toggle between light and dark themes using the dropdown menu</li>
        </ul>

        <br />
        <h3>HTML Attribute Categories:</h3>
        <div className={styles.twoColumnLayout}>
          {Object.entries(attributeGroups)
            .filter(([category]) => category !== 'other-attributes')
            .map(([category, attributes]) => (
              <div key={category} className={styles.category}>
                <h4>{formatCategoryName(category)}</h4>
                <div className={styles.attributeList}>
                  {attributes.join(', ')}
                </div>
              </div>
            ))}
        </div>

        <br />
        <h3>Contributions are welcome.</h3>
        <p>Please feel free to submit a Pull Request: <a href="https://github.com/cinkovic/HTML-Prism" target="_blank" rel="noopener" className={styles.githubLink}>https://github.com/cinkovic/HTML-Prism</a></p>

        <br />
        <h3>License:</h3>
        <p>This project is licensed under the MIT License.</p>
        <p>Vanilla JavaScript, script as well as React branch are available on GitHub via above link.</p>
        
        <br />
      </div>

    </div>
  );
} 