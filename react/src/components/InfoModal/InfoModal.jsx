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
        
        <h2>HTML Attribute Categories</h2>
        <div className={styles.twoColumnLayout}>
          {Object.entries(attributeGroups).map(([category, attributes]) => (
            <div key={category} className={styles.category}>
              <h4>{formatCategoryName(category)}</h4>
              <div className={styles.attributeList}>
                {attributes.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 