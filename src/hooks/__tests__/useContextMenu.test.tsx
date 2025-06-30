import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import useContextMenu from '../useContextMenu';

describe('useContextMenu', () => {
  const mockTabElement = {
    getBoundingClientRect: () => ({
      left: 100,
      top: 50,
      right: 200,
      bottom: 80,
      width: 100,
      height: 30,
      x: 100,
      y: 50,
      toJSON: () => {}
    })
  };

  beforeEach(() => {
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'tab-test-tab-id') {
        return mockTabElement as unknown as HTMLElement;
      }
      return null;
    });

    jest.spyOn(document, 'addEventListener').mockImplementation(jest.fn());
    jest.spyOn(document, 'removeEventListener').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default context menu state', () => {
    const { result } = renderHook(() => useContextMenu());
    
    expect(result.current.contextMenu).toEqual({
      x: 0,
      y: 0,
      visible: false,
      tabId: ''
    });
    expect(result.current.contextMenuRef.current).toBe(null);
  });

  it('should set context menu position based on tab element when handleIconClick is called', () => {
    const { result } = renderHook(() => useContextMenu());
    
    const mockEvent = {
      stopPropagation: jest.fn(),
      clientX: 50,
      clientY: 25
    } as unknown as React.MouseEvent;
    
    act(() => {
      result.current.handleIconClick(mockEvent, 'test-tab-id');
    });
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    
    expect(result.current.contextMenu).toEqual({
      x: 100,
      y: 50,
      visible: true,
      tabId: 'test-tab-id'
    });
  });

  it('should use click position as fallback when tab element is not found', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    
    const { result } = renderHook(() => useContextMenu());
    
    const mockEvent = {
      stopPropagation: jest.fn(),
      clientX: 50,
      clientY: 25
    } as unknown as React.MouseEvent;
    
    act(() => {
      result.current.handleIconClick(mockEvent, 'non-existent-tab');
    });
    
    expect(result.current.contextMenu).toEqual({
      x: 50,
      y: 25,
      visible: true,
      tabId: 'non-existent-tab'
    });
  });

  it('should hide context menu when hideContextMenu is called', () => {
    const { result } = renderHook(() => useContextMenu());
    
    act(() => {
      result.current.setContextMenu({
        x: 100,
        y: 50,
        visible: true,
        tabId: 'test-tab-id'
      });
    });
    
    expect(result.current.contextMenu.visible).toBe(true);
    
    act(() => {
      result.current.hideContextMenu();
    });
    
    expect(result.current.contextMenu).toEqual({
      x: 100,
      y: 50,
      visible: false,
      tabId: 'test-tab-id'
    });
    expect(result.current.contextMenu).toEqual({
      x: 100,
      y: 50,
      visible: false,
      tabId: 'test-tab-id'
    });
  });

  it('should add event listener when context menu becomes visible', () => {
    const { result } = renderHook(() => useContextMenu());
    
    act(() => {
      result.current.setContextMenu({
        x: 100,
        y: 50,
        visible: true,
        tabId: 'test-tab-id'
      });
    });
    
    expect(document.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('should remove event listener when context menu is hidden', () => {
    const { result } = renderHook(() => useContextMenu());
    
    act(() => {
      result.current.setContextMenu({
        x: 100,
        y: 50,
        visible: true,
        tabId: 'test-tab-id'
      });
    });
    
    act(() => {
      result.current.hideContextMenu();
    });
    
    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
});
