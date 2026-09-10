import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that animates a numeric value from its previous state to its new state
 * using authentic Svelte-style cubicOut easing physics (1 - (1 - t)^3).
 * Automatically respects prefers-reduced-motion.
 */
export function useAnimatedNumber(
  targetValue: number,
  duration: number = 600,
  decimals: number = 0
): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const currentValRef = useRef<number>(targetValue);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // If user prefers reduced motion, bypass animation
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayValue(targetValue);
      currentValRef.current = targetValue;
      return;
    }

    const startVal = currentValRef.current;
    const endVal = targetValue;
    const startTime = performance.now();
    const factor = Math.pow(10, decimals);

    if (startVal === endVal) return;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Svelte cubicOut easing: 1 - Math.pow(1 - progress, 3)
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * ease;

      currentValRef.current = current;
      setDisplayValue(Math.round(current * factor) / factor);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentValRef.current = endVal;
        setDisplayValue(endVal);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetValue, duration, decimals]);

  return displayValue;
}
