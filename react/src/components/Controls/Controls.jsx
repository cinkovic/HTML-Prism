import { useVisibility } from '../../context/VisibilityContext.jsx';
import { VISIBILITY_CONFIG } from '../../utils/constants';
import styles from './Controls.module.css';

function Controls() {
  // Access visibility context to toggle different HTML element categories
  const { visibility, toggleVisibility } = useVisibility();

  return (
    <div className={styles.controls}>
      {/* Render checkboxes for each visibility category defined in VISIBILITY_CONFIG */}
      {VISIBILITY_CONFIG.map(({ id, label }) => (
        <label key={id} className={styles.control}>
          <input
            type="checkbox"
            checked={visibility[id]}
            onChange={() => toggleVisibility(id)}
            className={styles[id]}
            aria-label={label}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export default Controls; 