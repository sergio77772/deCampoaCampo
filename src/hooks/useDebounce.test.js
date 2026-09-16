import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should debounce the value change', () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Advance timers by 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('initial');

    // Advance remaining 1ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });
});
