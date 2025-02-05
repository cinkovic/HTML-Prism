import styles from './Header.module.css';

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
      <h1>
        <span className={styles.headerSpan}>HTML</span> Prism
      </h1>
    </div>
  );
}

export default Header; 