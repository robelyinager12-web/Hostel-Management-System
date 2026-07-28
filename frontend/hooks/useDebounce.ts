import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value, updating only after
 * `delay` ms have passed without the value changing. Useful for search inputs.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}