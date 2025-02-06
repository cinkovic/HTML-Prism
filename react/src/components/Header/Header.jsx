import styles from './Header.module.css';
import ThemeDropdown from './ThemeDropdown';

function Header({ onVisualize }) {
  return (
    <div className={styles.header}>
      <button 
        onClick={onVisualize} 
        className={styles.button}
        aria-label="Visualize HTML"
      >
        Visualize
      </button>
      <div className={styles.spacer} />
      <ThemeDropdown />
    </div>
  );
}

export default Header; 