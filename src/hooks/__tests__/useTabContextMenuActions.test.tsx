import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import useTabContextMenuActions from '../useTabContextMenuActions';
import { Tab } from '../useDraggableTabs';

describe('useTabContextMenuActions', () => {
  const mockTabs: Tab[] = [
    { id: 'tab1', title: 'Tab 1' },
    { id: 'tab2', title: 'Tab 2', isActive: true },
    { id: 'tab3', title: 'Tab 3' }
  ];
  
  const setTabs = jest.fn();
  const openEditModal = jest.fn();
  const handleDuplicateTab = jest.fn();
  const handleDeleteTab = jest.fn();
  const hideContextMenu = jest.fn();
  
  beforeEach(() => {
    setTabs.mockClear();
    openEditModal.mockClear();
    handleDuplicateTab.mockClear();
    handleDeleteTab.mockClear();
    hideContextMenu.mockClear();
  });
  
  const renderTabContextMenuActionsHook = () => {
    return renderHook(() => useTabContextMenuActions({
      tabs: mockTabs,
      setTabs,
      openEditModal,
      handleDuplicateTab,
      handleDeleteTab,
      hideContextMenu
    }));
  };

  it('should move tab to first position when "setFirst" action is called', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('setFirst', 'tab3');
    });
    
    expect(setTabs).toHaveBeenCalledTimes(1);
    expect(setTabs).toHaveBeenCalledTimes(1);
    
    const newTabsArg = setTabs.mock.calls[0][0] as Tab[];
    
    expect(newTabsArg[0].id).toBe('tab3');
    expect(newTabsArg[1].id).toBe('tab1');
    expect(newTabsArg[2].id).toBe('tab2');
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should not modify tabs if tab with given id is not found', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('setFirst', 'non-existent-tab');
    });
    
    expect(setTabs).not.toHaveBeenCalled();
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should open edit modal when "rename" action is called', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('rename', 'tab2');
    });
    
    expect(openEditModal).toHaveBeenCalledWith('tab2');
    expect(openEditModal).toHaveBeenCalledWith('tab2');
    
      expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should call duplicate handler when "copy" action is called', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('copy', 'tab1');
    });
    
    expect(handleDuplicateTab).toHaveBeenCalledWith('tab1');
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should call duplicate handler when "duplicate" action is called', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('duplicate', 'tab1');
    });
    
    expect(handleDuplicateTab).toHaveBeenCalledWith('tab1');
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should call delete handler when "delete" action is called', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('delete', 'tab2');
    });
    
    expect(handleDeleteTab).toHaveBeenCalledWith('tab2');
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });

  it('should always hide context menu even for unknown actions', () => {
    const { result } = renderTabContextMenuActionsHook();
    
    act(() => {
      result.current.handleContextMenuAction('unknownAction', 'tab1');
    });
    
    expect(setTabs).not.toHaveBeenCalled();
    expect(openEditModal).not.toHaveBeenCalled();
    expect(handleDuplicateTab).not.toHaveBeenCalled();
    expect(handleDeleteTab).not.toHaveBeenCalled();
    
    expect(hideContextMenu).toHaveBeenCalledTimes(1);
  });
});
