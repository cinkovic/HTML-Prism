import styles from './Header.module.css';
import ThemeDropdown from './ThemeDropdown';

function Header({ onVisualize }) {
  return (
    <div className={styles.header}>
      {/* Trigger visualization of current HTML input */}
      <button 
        onClick={onVisualize} 
        className={styles.button}
        aria-label="Visualize HTML"
      >
        Visualize
      </button>
      <div className={styles.spacer} />
      {/* Theme selection and app information dropdown */}
      <ThemeDropdown />
    </div>
  );
}

export default Header; 