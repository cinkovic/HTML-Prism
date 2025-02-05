import { useEffect, useRef } from 'react';
import { useVisibility } from '../../context/VisibilityContext.jsx';
import { parseHTML } from '../../utils/parser';
import { generateTreeHTML } from '../../utils/treeGenerator';
import styles from './TreeView.module.css';
import { VISIBILITY_CONFIG } from '../../utils/constants';

function TreeView({ htmlContent }) {
  const outputRef = useRef(null);
  const { visibility } = useVisibility();

  useEffect(() => {
    if (!htmlContent) return;
    
    const parsedDoc = parseHTML(htmlContent);
    const treeHTML = generateTreeHTML(parsedDoc.documentElement);
    
    if (outputRef.current) {
      outputRef.current.innerHTML = `<ul>${treeHTML}</ul>`;
      addCollapsibleFunctionality();
    }
  }, [htmlContent]);

  useEffect(() => {
    updateVisibility();
  }, [visibility]);

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

  const updateVisibility = () => {
    if (!outputRef.current) return;

    VISIBILITY_CONFIG.forEach(({ id, class: className }) => {
      const elements = outputRef.current.querySelectorAll(`.${className}`);
      elements.forEach(element => {
        element.style.display = visibility[id] ? '' : 'none';
      });
    });
  };

  return (
    <div ref={outputRef} className={styles.treeView} />
  );
}

export default TreeView; 