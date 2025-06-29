import { useState, useCallback } from 'react';
import { Tab } from '@/hooks/useDraggableTabs';

interface UseTabManagementProps {
  initialTabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}

interface UseTabManagementReturn {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  handleAddTab: (index: number) => void;
  handleTabClick: (tabId: string) => void;
  handleDuplicateTab: (tabId: string) => void;
  handleDeleteTab: (tabId: string) => void;
}

/**
 * Custom hook for managing tab operations like adding, activating, duplicating, and deleting tabs
 */
const useTabManagement = ({ initialTabs = [], onTabChange }: UseTabManagementProps): UseTabManagementReturn => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    { id: '1', title: 'Info', isActive: true, isDefault: true , icon: 'info.svg' },
    { id: '2', title: 'Details', isDefault: false , icon: 'file.svg' },
    { id: '3', title: 'Other', isDefault: false , icon: 'file1.svg' },
    { id: '4', title: 'Ending', isDefault: false , icon: 'check.svg' },
  ]);

  // Generate a new unique tab ID
  const generateNewTabId = useCallback(() => {
    return String(Math.max(...tabs.map(t => parseInt(t.id))) + 1);
  }, [tabs]);

  // Handle adding a new tab at the specified index
  const handleAddTab = useCallback((index: number) => {
    const newTabId = generateNewTabId();
    const newTab: Tab = { id: newTabId, title: `New Tab` };
    
    const newTabs = [...tabs];
    newTabs.splice(index, 0, newTab);
    
    setTabs(newTabs);
  }, [tabs, generateNewTabId]);

  // Handle tab click to activate it
  const handleTabClick = useCallback((tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    
    // Notify parent component about tab change
    if (onTabChange) {
      onTabChange(tabId);
    }
  }, [tabs, onTabChange]);

  // Handle duplicating a tab
  const handleDuplicateTab = useCallback((tabId: string) => {
    const tabToDuplicate = tabs.find(tab => tab.id === tabId);
    if (tabToDuplicate) {
      const newTabId = generateNewTabId();
      const newTab: Tab = { 
        ...tabToDuplicate, 
        id: newTabId, 
        title: `${tabToDuplicate.title} (Copy)`, 
        isActive: false 
      };
      const tabIndex = tabs.findIndex(tab => tab.id === tabId);
      const newTabs = [...tabs];
      newTabs.splice(tabIndex + 1, 0, newTab);
      setTabs(newTabs);
    }
  }, [tabs, generateNewTabId]);

  // Handle deleting a tab
  const handleDeleteTab = useCallback((tabId: string) => {
    const tabToDelete = tabs.find(tab => tab.id === tabId);
    if (tabToDelete && !tabToDelete.isDefault && tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      // If we're deleting the active tab, activate another tab
      if (tabToDelete.isActive) {
        const newActiveIndex = Math.max(0, tabs.findIndex(tab => tab.id === tabId) - 1);
        newTabs[newActiveIndex].isActive = true;
      }
      setTabs(newTabs);
    }
  }, [tabs]);

  return {
    tabs,
    setTabs,
    handleAddTab,
    handleTabClick,
    handleDuplicateTab,
    handleDeleteTab
  };
};

export default useTabManagement;
