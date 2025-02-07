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
  const { toggleAll } = useVisibility();
  
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
          
          <button onClick={() => handleToggleAll(true)} className={styles.menuItem}>
            {/* ✓ Show All Filters */}
            ◉ Show All Filters
          </button>

          <button onClick={() => handleToggleAll(false)} className={styles.menuItem}>
            {/* ✕ Hide All Filters */}
            ◌ Hide All Filters
          </button>

          <div className={styles.divider}></div>

          <button 
            onClick={() => toggleTheme('light')}
            data-active={currentTheme === 'light'}
          >
            {/* ☀️ Light Mode */}
            ⚪ Light Mode
          </button>

          <button 
            onClick={() => toggleTheme('dark')}
            data-active={currentTheme === 'dark'}
          >
            {/* 🌙 Dark Mode */}
            ⚫ Dark Mode
          </button>

          <div className={styles.divider}></div>
          
          <button 
            onClick={() => setShowInfo(true)}
            className={styles.menuItem}
          >
            {/* ℹ️ About HTML-Prism */}
            ⓘ About HTML-Prism
          </button>

        </div>
      )}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
} 