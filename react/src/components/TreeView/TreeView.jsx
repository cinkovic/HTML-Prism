import { useEffect, useRef } from 'react';
import { useVisibility } from '../../context/VisibilityContext.jsx';
import { parseHTML } from '../../utils/parser';
import { generateTreeHTML } from '../../utils/treeGenerator';
import { VISIBILITY_CONFIG } from '../../utils/constants';
import styles from './TreeView.module.css';

function TreeView({ htmlContent }) {
  const outputRef = useRef(null);
  const { visibility } = useVisibility();

  useEffect(() => {
    if (!htmlContent) return;
    
    const parsedHTML = parseHTML(htmlContent);
    const treeHTML = generateTreeHTML(parsedHTML);
    
    if (outputRef.current) {
      outputRef.current.innerHTML = treeHTML;
      addCollapsibleFunctionality();
    }
  }, [htmlContent]);

  useEffect(() => {
    updateVisibility();
  }, [visibility]);

  const addCollapsibleFunctionality = () => {
    const elements = outputRef.current.querySelectorAll('.collapsible');
    elements.forEach(item => {
      item.addEventListener('click', handleCollapse);
    });

    return () => {
      elements.forEach(item => {
        item.removeEventListener('click', handleCollapse);
      });
    };
  };

  const handleCollapse = (e) => {
    e.stopPropagation();
    const parentLi = e.target.closest('li');
    if (parentLi) {
      parentLi.classList.toggle('collapsed');
    }
  };

  const updateVisibility = () => {
    if (!outputRef.current) return;

    Object.entries(visibility).forEach(([key, isVisible]) => {
      const className = VISIBILITY_CONFIG.find(config => config.id === key)?.class;
      if (className) {
        const elements = outputRef.current.querySelectorAll(`.${className}`);
        elements.forEach(element => {
          element.style.display = isVisible ? '' : 'none';
        });
      }
    });
  };

  return (
    <div ref={outputRef} className={styles.treeView} />
  );
}

export default TreeView; 