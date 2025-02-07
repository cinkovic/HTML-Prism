import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useVisibility } from '../../context/VisibilityContext.jsx';
import { parseHTML } from '../../utils/parser';
import { generateTreeHTML } from '../../utils/treeGenerator';
import styles from './TreeView.module.css';
import { VISIBILITY_CONFIG } from '../../utils/constants';

// Custom debounce implementation to limit the frequency of function calls
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

  // Memoize tree generation to prevent unnecessary recalculations
  const generateTree = useCallback((content) => {
    if (!content) return '';
    const parsedDoc = parseHTML(content);
    return generateTreeHTML(parsedDoc.documentElement);
  }, []);

  // Cache tree HTML generation result until htmlContent changes
  const treeHTML = useMemo(() => generateTree(htmlContent), [htmlContent, generateTree]);

  // Update visibility of elements based on current visibility state
  const updateVisibility = useCallback(() => {
    if (!outputRef.current) return;

    // Update visibility for each category
    VISIBILITY_CONFIG.forEach(({ id, class: className }) => {
      const elements = outputRef.current.querySelectorAll(`.${className}`);
      elements.forEach(element => {
        element.style.display = visibility[id] ? '' : 'none';
      });
    });
  }, [visibility]);

  // Initialize tree view and set up collapsible functionality
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = `<ul>${treeHTML}</ul>`;
      addCollapsibleFunctionality();
    }
  }, [treeHTML]);

  // Update visibility whenever visibility state changes
  useEffect(() => {
    updateVisibility();
  }, [visibility, updateVisibility]);

  // Add click handlers for collapsible tree nodes
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

  // Toggle collapsed state of tree nodes
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