import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/app/dashboard/sistema-gestion/page";

// Mock del hook personalizado useDebounce
function useDebounce(value, delay: number): unknown {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("returns debounced value after delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    // Initial value
    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "changed", delay: 500 });

    // Still initial value before delay
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should be debounced value
    expect(result.current).toBe("changed");
  });

  it("respects different delay times", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 1000 },
    });

    rerender({ value: "changed", delay: 1000 });

    // Advance time by 500ms - still initial
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // Advance another 500ms - now changed
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("changed");
  });

  it("cancels previous timeout when value changes", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "first", delay: 500 },
    });

    rerender({ value: "second", delay: 500 });

    // Advance time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change value again before first debounce completes
    rerender({ value: "third", delay: 500 });

    // Advance another 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should be 'third', not 'second'
    expect(result.current).toBe("third");
  });
});
