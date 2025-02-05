import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useVisibility } from '../../context/VisibilityContext.jsx';
import { parseHTML } from '../../utils/parser';
import { generateTreeHTML } from '../../utils/treeGenerator';
import styles from './TreeView.module.css';
import { VISIBILITY_CONFIG } from '../../utils/constants';

// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function TreeView({ htmlContent }) {
  const outputRef = useRef(null);
  const { visibility } = useVisibility();

  // Memoize tree generation
  const generateTree = useCallback((content) => {
    if (!content) return '';
    const parsedDoc = parseHTML(content);
    return generateTreeHTML(parsedDoc.documentElement);
  }, []);

  const treeHTML = useMemo(() => generateTree(htmlContent), [htmlContent, generateTree]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = `<ul>${treeHTML}</ul>`;
      addCollapsibleFunctionality();
    }
  }, [treeHTML]);

  // Optimize visibility updates
  const updateVisibility = useCallback(() => {
    if (!outputRef.current) return;
    
    // Batch DOM reads
    const updates = VISIBILITY_CONFIG.map(({ id, class: className }) => {
      const elements = outputRef.current.querySelectorAll(`.${className}`);
      return { elements, isVisible: visibility[id] };
    });

    // Batch DOM writes
    requestAnimationFrame(() => {
      updates.forEach(({ elements, isVisible }) => {
        elements.forEach(element => {
          element.style.display = isVisible ? '' : 'none';
        });
      });
    });
  }, [visibility]);

  // Debounced visibility update
  const debouncedUpdate = useMemo(
    () => debounce(updateVisibility, 16),
    [updateVisibility]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [debouncedUpdate]);

  const addCollapsibleFunctionality = () => {
    if (!outputRef.current) return;
    
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

  return (
    <div ref={outputRef} className={styles.treeView} />
  );
}

export default TreeView; 