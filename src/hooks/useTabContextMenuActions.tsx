import { useCallback } from 'react';
import { Tab } from './useDraggableTabs';

interface UseTabContextMenuActionsProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  openEditModal: (tabId: string) => void;
  handleDuplicateTab: (tabId: string) => void;
  handleDeleteTab: (tabId: string) => void;
  hideContextMenu: () => void;
}

/**
 * Custom hook for handling tab context menu actions
 */
const useTabContextMenuActions = ({
  tabs,
  setTabs,
  openEditModal,
  handleDuplicateTab,
  handleDeleteTab,
  hideContextMenu
}: UseTabContextMenuActionsProps) => {
  
  const handleContextMenuAction = useCallback((action: string, tabId: string) => {
    switch(action) {
      case 'setFirst':
        // Move the tab to the first position
        const tabToMove = tabs.find(tab => tab.id === tabId);
        if (tabToMove) {
          const newTabs = [tabToMove, ...tabs.filter(tab => tab.id !== tabId)];
          setTabs(newTabs);
        }
        break;
      case 'rename':
        openEditModal(tabId);
        break;
      case 'copy':
      case 'duplicate':
        // Use the existing duplicate handler for both copy and duplicate actions
        handleDuplicateTab(tabId);
        break;
      case 'delete':
        handleDeleteTab(tabId);
        break;
    }
    // Close the context menu after action
    hideContextMenu();
  }, [tabs, setTabs, openEditModal, handleDuplicateTab, handleDeleteTab, hideContextMenu]);

  return { handleContextMenuAction };
};

export default useTabContextMenuActions;
