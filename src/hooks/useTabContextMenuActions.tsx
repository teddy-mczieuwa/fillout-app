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
        handleDuplicateTab(tabId);
        break;
      case 'delete':
        handleDeleteTab(tabId);
        break;
    }
    hideContextMenu();
  }, [tabs, setTabs, openEditModal, handleDuplicateTab, handleDeleteTab, hideContextMenu]);

  return { handleContextMenuAction };
};

export default useTabContextMenuActions;
