import { useState, useRef, useEffect } from 'react';
import styles from './ThemeDropdown.module.css';

export default function ThemeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const toggleTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsOpen(false);
  };

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

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
          <button onClick={() => toggleTheme('light')}>
            ☀️ Light Mode
          </button>
          <button onClick={() => toggleTheme('dark')}>
            🌙 Dark Mode
          </button>
        </div>
      )}
    </div>
  );
} 