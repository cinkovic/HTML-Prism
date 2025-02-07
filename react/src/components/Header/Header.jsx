import styles from './Header.module.css';
import ThemeDropdown from './ThemeDropdown';
import { useVisibility } from '../../context/VisibilityContext';

function Header({ onVisualize }) {
  const { visibility } = useVisibility();

  return (
    <div className={`${styles.header} ${!visibility.showInputControls ? styles.minimal : ''}`}>
      {visibility.showInputControls && (
        <button 
          onClick={onVisualize} 
          className={styles.button}
          aria-label="Visualize HTML"
        >
          Visualize
        </button>
      )}
      <div className={styles.spacer} />
      <ThemeDropdown />
    </div>
  );
}

export default Header; 