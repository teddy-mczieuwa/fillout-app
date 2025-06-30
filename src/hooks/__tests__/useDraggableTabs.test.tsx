import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import useDraggableTabs, { Tab } from '../useDraggableTabs';

describe('useDraggableTabs', () => {
  const mockTabs: Tab[] = [
    { id: 'tab1', title: 'Tab 1', isActive: true },
    { id: 'tab2', title: 'Tab 2' },
    { id: 'tab3', title: 'Tab 3' }
  ];
  
  const setTabs = jest.fn();
  
  const createDragEvent = (overrides = {}) => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: {
        setData: jest.fn(),
        setDragImage: jest.fn(),
        effectAllowed: 'none',
      },
      clientX: 100,
      clientY: 50,
      nativeEvent: {
        offsetX: 10,
        offsetY: 5
      },
      currentTarget: document.createElement('div'),
      ...overrides
    };
    return event as unknown as React.DragEvent<HTMLElement>;
  };
  
  beforeEach(() => {
    jest.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
      return node;
    });
    jest.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => {
      return node;
    });
    jest.spyOn(document.body, 'contains').mockReturnValue(true);
    
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
    setTabs.mockClear();
  });

  it('should initialize with null draggedTab state', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    expect(result.current.draggedTab).toBeNull();
  });

  it('should set draggedTab when handleDragStart is called', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    const dragEvent = createDragEvent();
    const tab = mockTabs[0];
    
    act(() => {
      result.current.handleDragStart(dragEvent, tab, 0);
    });
    
    expect(result.current.draggedTab).toEqual(tab);
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', '0');
    expect(dragEvent.dataTransfer.setDragImage).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('should handle errors in dragStart gracefully', () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    const dragEvent = createDragEvent({
      dataTransfer: null
    });
    
    act(() => {
      result.current.handleDragStart(dragEvent, mockTabs[0], 0);
    });
    
    expect(console.error).toHaveBeenCalled();
    expect(result.current.draggedTab).toBeNull();
  });

  it('should reorder tabs when handleDragOver is called with valid horizontal movement', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    const dragStartEvent = createDragEvent();
    act(() => {
      result.current.handleDragStart(dragStartEvent, mockTabs[0], 0);
    });
    
    const dragOverEvent = createDragEvent({
      clientX: 200,
      clientY: 55
    });
    
    act(() => {
      result.current.handleDragOver(dragOverEvent, 2);
    });
    
    expect(setTabs).toHaveBeenCalled();
    
    const newTabsArg = setTabs.mock.calls[0][0];
    
    if (typeof newTabsArg === 'function') {
      const tabsUpdater = newTabsArg as (prevTabs: Tab[]) => Tab[];
      const newTabs = tabsUpdater(mockTabs);
      expect(newTabs[2].id).toBe('tab1');
      expect(newTabs[0].id).toBe('tab2');
      expect(newTabs[1].id).toBe('tab3');
    } else {
      const directTabsUpdate = newTabsArg as Tab[];
      expect(directTabsUpdate[2].id).toBe('tab1');
    }
  });

  it('should not reorder tabs when movement is primarily vertical', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    const dragStartEvent = createDragEvent();
    act(() => {
      result.current.handleDragStart(dragStartEvent, mockTabs[0], 0);
    });
    
    const dragOverEvent = createDragEvent({
      clientX: 110,
      clientY: 150
    });
    
    act(() => {
      result.current.handleDragOver(dragOverEvent, 2);
    });
    
    expect(setTabs).not.toHaveBeenCalled();
  });

  it('should reset drag state when handleDragEnd is called', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    const dragStartEvent = createDragEvent();
    act(() => {
      result.current.handleDragStart(dragStartEvent, mockTabs[0], 0);
    });
    
    expect(result.current.draggedTab).not.toBeNull();
    
    act(() => {
      result.current.handleDragEnd();
    });
    
    expect(result.current.draggedTab).toBeNull();
  });

  it('should reset drag state when handleDrop is called', () => {
    const { result } = renderHook(() => useDraggableTabs({ tabs: mockTabs, setTabs }));
    
    const dragStartEvent = createDragEvent();
    act(() => {
      result.current.handleDragStart(dragStartEvent, mockTabs[0], 0);
    });
    
    expect(result.current.draggedTab).not.toBeNull();
    
    const dropEvent = createDragEvent();
    act(() => {
      result.current.handleDrop(dropEvent);
    });
    
    expect(result.current.draggedTab).toBeNull();
    expect(dropEvent.preventDefault).toHaveBeenCalled();
  });

});
