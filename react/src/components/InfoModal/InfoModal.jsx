import { useEffect, useRef } from 'react';
import styles from './InfoModal.module.css';
import { attributeGroups } from '../../utils/constants';

export default function InfoModal({ onClose }) {
  const modalRef = useRef(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Format category names from kebab-case to Title Case
  const formatCategoryName = (name) => 
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Stop event propagation to prevent closing when clicking modal content */}
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} ref={modalRef}>
        {/* Modal content structure */}
        <button className={styles.closeButton} onClick={onClose}>×</button>

        {/* Instructions section */}
        <h3 className={styles.modalTitle}>To use HTML Prism:</h3>
        <ul className={styles.instructionsList}>
          <li>Paste your HTML code into the input area</li>
          <li>Click "Visualize" to analyze your HTML</li>
          <li>Use the checkboxes to toggle different attribute categories</li>
          <li>Click on elements to collapse/expand their children</li>
          <li>Toggle between light and dark themes using the dropdown menu</li>
        </ul>

        {/* Attribute categories section */}
        <h3 className={styles.modalTitle}>HTML Attribute Categories:</h3>
        <div className={styles.twoColumnLayout}>
          {/* Filter out 'other-attributes' category and render remaining categories */}
          {Object.entries(attributeGroups)
            .filter(([category]) => category !== 'other-attributes')
            .map(([category, attributes]) => (
              <div key={category} className={styles.category}>
                <h3 className={styles.categoryTitle}>{formatCategoryName(category)}</h3>
                <div className={styles.attributeList}>
                  {attributes.join(', ')}
                </div>
              </div>
            ))}
        </div>

        {/* Footer information */}
        <h3 className={styles.modalTitle}>Contributions are welcome.</h3>
        <p className={styles.modalText}>
          Please feel free to submit a Pull Request:{' '}
          <a 
            href="https://github.com/cinkovic/HTML-Prism" 
            target="_blank" 
            rel="noopener" 
            className={styles.githubLink}
          >
            https://github.com/cinkovic/HTML-Prism
          </a>
        </p>

        <h3 className={styles.modalTitle}>License:</h3>
        <p className={styles.modalText}>This project is licensed under the MIT License.</p>
        <p className={styles.modalText}>
          Source code for React app and vanilla JavaScript implementation are available as GitHub branches in above repository.
        </p>
      </div>
    </div>
  );
} 