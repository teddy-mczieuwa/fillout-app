import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import useTabManagement from '../useTabManagement';
import { Tab } from '../useDraggableTabs';

describe('useTabManagement', () => {
  const mockInitialTabs: Tab[] = [
    { id: '1', title: 'Tab 1', isActive: true, isDefault: true },
    { id: '2', title: 'Tab 2' },
    { id: '3', title: 'Tab 3', isDefault: false }
  ];
  
  const mockOnTabChange = jest.fn();
  
  beforeEach(() => {
    mockOnTabChange.mockClear();
  });
  
  it('should initialize with provided tabs', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    expect(result.current.tabs).toEqual(mockInitialTabs);
  });
  
  it('should initialize with default tabs when no initialTabs are provided', () => {
    const { result } = renderHook(() => useTabManagement({ 
      onTabChange: mockOnTabChange
    }));
    
    expect(result.current.tabs.length).toBe(4);
    expect(result.current.tabs[0].title).toBe('Info');
    expect(result.current.tabs[0].isActive).toBe(true);
    expect(result.current.tabs[0].isDefault).toBe(true);
  });
  
  it('should add a new tab at the specified index', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleAddTab(1);
    });
    
    expect(result.current.tabs.length).toBe(4);
    expect(result.current.tabs.length).toBe(4);
    expect(result.current.tabs[1].title).toBe('New Tab');
    expect(result.current.tabs[1].id).toBe('4'); 
    
    expect(result.current.tabs[0].id).toBe('1');
    expect(result.current.tabs[2].id).toBe('2');
    expect(result.current.tabs[3].id).toBe('3');
  });
  
  it('should activate a tab when clicked and call onTabChange', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    expect(result.current.tabs[0].isActive).toBe(true);
    expect(result.current.tabs[1].isActive).toBeFalsy();
    
    act(() => {
      result.current.handleTabClick('2');
    });
    
    expect(result.current.tabs[0].isActive).toBeFalsy();
    expect(result.current.tabs[1].isActive).toBe(true);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('2');
  });
  
  it('should duplicate a tab', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDuplicateTab('2');
    });
    
    expect(result.current.tabs.length).toBe(4);
    expect(result.current.tabs.length).toBe(4);
    expect(result.current.tabs[2].title).toBe('Tab 2 (Copy)');
    expect(result.current.tabs[2].id).toBe('4'); 
    expect(result.current.tabs[2].isActive).toBe(false);
    
    expect(result.current.tabs[0].id).toBe('1');
    expect(result.current.tabs[1].id).toBe('2');
    expect(result.current.tabs[3].id).toBe('3');
  });
  
  it('should delete a non-default tab', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDeleteTab('2');
    });
    
    expect(result.current.tabs.length).toBe(2);
    expect(result.current.tabs[0].id).toBe('1');
    expect(result.current.tabs[1].id).toBe('3');
    
    expect(result.current.tabs[0].isActive).toBe(true);
  });
  
  it('should not delete a default tab', () => {
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: mockInitialTabs,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDeleteTab('1');
    });
    
    expect(result.current.tabs.length).toBe(3);
    expect(result.current.tabs[0].id).toBe('1');
  });
  
  it('should not delete the last remaining tab', () => {
    const singleTab = [{ id: '1', title: 'Only Tab', isDefault: false }];
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: singleTab,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDeleteTab('1');
    });
    
    expect(result.current.tabs.length).toBe(1);
    expect(result.current.tabs.length).toBe(1);
    expect(result.current.tabs[0].id).toBe('1');
  });
  
  it('should activate the previous tab when deleting the active tab', () => {
    const tabsWithSecondActive = [
      { id: '1', title: 'Tab 1', isDefault: false },
      { id: '2', title: 'Tab 2', isActive: true, isDefault: false },
      { id: '3', title: 'Tab 3', isDefault: false }
    ];
    
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: tabsWithSecondActive,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDeleteTab('2');
    });
    
    expect(result.current.tabs.length).toBe(2);
    expect(result.current.tabs[0].id).toBe('1');
    expect(result.current.tabs[1].id).toBe('3');
    
    expect(result.current.tabs[0].isActive).toBe(true);
  });
  
  it('should activate the first tab when deleting the first active tab', () => {
    const tabsWithFirstActive = [
      { id: '1', title: 'Tab 1', isActive: true, isDefault: false },
      { id: '2', title: 'Tab 2', isDefault: false },
      { id: '3', title: 'Tab 3', isDefault: false }
    ];
    
    const { result } = renderHook(() => useTabManagement({ 
      initialTabs: tabsWithFirstActive,
      onTabChange: mockOnTabChange
    }));
    
    act(() => {
      result.current.handleDeleteTab('1');
    });
    
    expect(result.current.tabs.length).toBe(2);
    expect(result.current.tabs[0].id).toBe('2');
    expect(result.current.tabs[1].id).toBe('3');
    
    expect(result.current.tabs[0].isActive).toBe(true);
  });
});
