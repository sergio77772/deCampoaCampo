import { useState, useEffect } from 'react';

/**
 * Debounce un valor — retrasa la actualización hasta que el usuario
 * deja de escribir por `delay` ms.
 * @param {any} value
 * @param {number} delay - en ms (default 300)
 * @returns {any} debouncedValue
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
