import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import useAddButtonHover from '../useAddButtonHover';

describe('useAddButtonHover', () => {
  it('should initialize with null showAddButton state', () => {
    const { result } = renderHook(() => useAddButtonHover());
    
    expect(result.current.showAddButton).toBeNull();
  });

  it('should update showAddButton state when handleMouseEnter is called', () => {
    const { result } = renderHook(() => useAddButtonHover());
    
    act(() => {
      result.current.handleMouseEnter(2);
    });
    
    expect(result.current.showAddButton).toBe(2);
  });

  it('should reset showAddButton state to null when handleMouseLeave is called', () => {
    const { result } = renderHook(() => useAddButtonHover());
    
    act(() => {
      result.current.handleMouseEnter(3);
    });
    expect(result.current.showAddButton).toBe(3);
    
    act(() => {
      result.current.handleMouseLeave();
    });
    
    expect(result.current.showAddButton).toBeNull();
  });

  it('should update showAddButton state when setShowAddButton is called directly', () => {
    const { result } = renderHook(() => useAddButtonHover());
    
    act(() => {
      result.current.setShowAddButton(5);
    });
    
    expect(result.current.showAddButton).toBe(5);
  });

  it('should handle multiple state changes correctly', () => {
    const { result } = renderHook(() => useAddButtonHover());
    
    expect(result.current.showAddButton).toBeNull();
    
    act(() => {
      result.current.handleMouseEnter(1);
    });
    expect(result.current.showAddButton).toBe(1);
    
    act(() => {
      result.current.handleMouseEnter(4);
    });
    expect(result.current.showAddButton).toBe(4);
    
    act(() => {
      result.current.handleMouseLeave();
    });
    act(() => {
      result.current.handleMouseLeave();
    });
    expect(result.current.showAddButton).toBeNull();
  });
});
