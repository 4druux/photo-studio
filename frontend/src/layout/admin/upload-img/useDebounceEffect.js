import { useEffect, useMemo } from "react";

const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
};

export function useDebounceEffect(fn, waitTime, deps) {
  const debouncedFn = useMemo(() => debounce(fn, waitTime), [fn, waitTime]);

  useEffect(() => {
    return debouncedFn(deps);
  }, deps);
}
