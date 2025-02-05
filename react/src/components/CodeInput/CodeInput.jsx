import { useRef, useEffect } from 'react';
import styles from './CodeInput.module.css';
import { SAMPLE_HTML } from '../../utils/constants';

function CodeInput({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && !value) {
      onChange(SAMPLE_HTML);
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      id="input"
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your HTML here..."
    />
  );
}

export default CodeInput; 