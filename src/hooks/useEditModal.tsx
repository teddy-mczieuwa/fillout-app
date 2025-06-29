import { useState, useRef, useEffect } from 'react';
import { Tab } from '@/hooks/useDraggableTabs';

interface EditModalState {
  visible: boolean;
  tabId: string;
  title: string;
}

interface UseEditModalProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

interface UseEditModalReturn {
  editModal: EditModalState;
  modalInputRef: React.RefObject<HTMLInputElement | null>;
  setEditModal: React.Dispatch<React.SetStateAction<EditModalState>>;
  handleTabRename: () => void;
  handleModalKeyDown: (e: React.KeyboardEvent) => void;
  openEditModal: (tabId: string) => void;
  closeEditModal: () => void;
}

/**
 * Custom hook for managing edit modal state and behavior
 */
const useEditModal = ({ tabs, setTabs }: UseEditModalProps): UseEditModalReturn => {
  const [editModal, setEditModal] = useState<EditModalState>({ 
    visible: false, 
    tabId: '', 
    title: '' 
  });
  
  const modalInputRef = useRef<HTMLInputElement>(null);

  // Handle tab rename submission
  const handleTabRename = () => {
    if (editModal.title.trim()) {
      setTabs(tabs.map(tab => 
        tab.id === editModal.tabId ? { ...tab, title: editModal.title } : tab
      ));
      closeEditModal();
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (editModal.visible && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [editModal.visible]);

  // Handle keyboard events in the modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTabRename();
    } else if (e.key === 'Escape') {
      closeEditModal();
    }
  };

  const openEditModal = (tabId: string) => {
    const tabToEdit = tabs.find(tab => tab.id === tabId);
    if (tabToEdit) {
      setEditModal({
        visible: true,
        tabId: tabId,
        title: tabToEdit.title
      });
    }
  };

  const closeEditModal = () => {
    setEditModal(prev => ({ ...prev, visible: false }));
  };

  return {
    editModal,
    modalInputRef,
    setEditModal,
    handleTabRename,
    handleModalKeyDown,
    openEditModal,
    closeEditModal
  };
};

export default useEditModal;
