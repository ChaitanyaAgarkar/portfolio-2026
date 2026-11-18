import { describe, expect, it } from 'vitest';
import { computePercentage, formatNumber, formatRelativeTimestamp } from '@/lib/utils/formatters';

describe('Formatters', () => {
  it('formats numbers with locale thousands separators', () => {
    expect(formatNumber(179919)).toBe('179,919');
    expect(formatNumber(548)).toBe('548');
  });

  it('computes safe bounded percentages', () => {
    expect(computePercentage(204, 975)).toBe(20.9);
    expect(computePercentage(10, 0)).toBe(0);
    expect(computePercentage(500, 100)).toBe(100);
  });

  it('handles invalid timestamps safely', () => {
    expect(formatRelativeTimestamp('invalid')).toBe('Recent');
    expect(formatRelativeTimestamp('0')).toBe('Recent');
  });
});

