import { useState, useRef, useEffect } from 'react';
import styles from './ThemeDropdown.module.css';
import InfoModal from '../InfoModal/InfoModal';
import { useVisibility } from '../../context/VisibilityContext';

export default function ThemeDropdown() {
  // State for dropdown visibility and theme selection
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default theme
  const dropdownRef = useRef(null);
  const { toggleAll, toggleInputControls, visibility, updateHtmlContent } = useVisibility();
  
  // Apply theme and persist selection to localStorage
  const toggleTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  // Toggle all visibility filters and close dropdown
  const handleToggleAll = (show) => {
    toggleAll(show);
    setIsOpen(false);
  };

  // Add handler for input controls toggle
  const handleInputToggle = () => {
    toggleInputControls();
    setIsOpen(false);  // Close menu after toggle
  };

  const handlePasteFromClipboard = () => {
    // Create hidden textarea
    const textarea = document.createElement('textarea');
    textarea.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    
    // Try to paste
    const tryPaste = () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.readText()
          .then(text => {
            if (text) {
              updateHtmlContent(text);
              if (!visibility.showInputControls) {
                toggleInputControls();
              }
            }
          })
          .catch(() => null)
          .finally(() => {
            document.body.removeChild(textarea);
            setIsOpen(false);
          });
      } else {
        // Fallback for non-secure contexts
        setTimeout(() => {
          if (textarea.value) {
            updateHtmlContent(textarea.value);
            if (!visibility.showInputControls) {
              toggleInputControls();
            }
          }
          document.body.removeChild(textarea);
          setIsOpen(false);
        }, 100);
      }
    };

    // Handle paste event
    textarea.onpaste = () => {
      setTimeout(() => {
        if (textarea.value) {
          updateHtmlContent(textarea.value);
          if (!visibility.showInputControls) {
            toggleInputControls();
          }
        }
        document.body.removeChild(textarea);
        setIsOpen(false);
      }, 100);
    };

    // Try both methods
    if (document.execCommand('paste') === false) {
      tryPaste();
    }
  };

  useEffect(() => {
    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        HTML <span className={styles.prism}>Prism</span> ▾
      </button>
      {isOpen && (
        <div className={styles.menu}>
          <button 
            onClick={handlePasteFromClipboard}
            className={styles.menuItem}
            data-icon="📄"
          >
            Paste from Clipboard
          </button>

          <div className={styles.divider}></div>

          <button 
            onClick={handleInputToggle}
            className={styles.menuItem}
            data-icon={visibility.showInputControls ? "⊡" : "⊞"}
          >
            {visibility.showInputControls ? "Hide Controls" : "Show Controls"}
          </button>

          <div className={styles.divider}></div>

          <button 
            onClick={() => handleToggleAll(true)} 
            className={styles.menuItem}
            data-icon="◉"
          >
            Show All Filters
          </button>

          <button 
            onClick={() => handleToggleAll(false)} 
            className={styles.menuItem}
            data-icon="◌"
          >
            Hide All Filters
          </button>

          <div className={styles.divider}></div>

          <button 
            onClick={() => toggleTheme('light')}
            className={styles.menuItem}
            data-active={currentTheme === 'light'}
            data-icon="⚪"
          >
            Light Mode
          </button>

          <button 
            onClick={() => toggleTheme('dark')}
            className={styles.menuItem}
            data-active={currentTheme === 'dark'}
            data-icon="⚫"
          >
            Dark Mode
          </button>

          <div className={styles.divider}></div>
          
          <button 
            onClick={() => setShowInfo(true)}
            className={styles.menuItem}
            data-icon="❓"
          >
            About HTML-Prism
          </button>

        </div>
      )}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
} 