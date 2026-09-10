import React from 'react';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { formatCurrency, formatNumber } from '../../lib/formatters';

interface AnimatedNumberProps {
  value: number;
  type?: 'currency' | 'number' | 'percent' | 'raw';
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  type = 'number',
  decimals = 0,
  duration = 600,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const animatedValue = useAnimatedNumber(value, duration, decimals);

  let formatted = '';
  if (type === 'currency') {
    formatted = formatCurrency(animatedValue);
  } else if (type === 'number') {
    formatted = formatNumber(animatedValue);
  } else if (type === 'percent') {
    formatted = `${Math.round(animatedValue)}%`;
  } else {
    formatted = animatedValue.toFixed(decimals);
  }

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
