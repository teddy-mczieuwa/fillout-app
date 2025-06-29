'use client';

import React, { useRef } from 'react';
import useDraggableTabs from '@/hooks/useDraggableTabs';
import useTabManagement from '@/hooks/useTabManagement';
import useContextMenu from '@/hooks/useContextMenu';
import useEditModal from '@/hooks/useEditModal';
import useAddButtonHover from '@/hooks/useAddButtonHover';
import useTabContextMenuActions from '@/hooks/useTabContextMenuActions';
import { Tab } from '@/hooks/useDraggableTabs';

// Import components
import TabItem from './TabItem';
import TabSeparator from './TabSeparator';
import AddTabButton from './AddTabButton';
import AddPageButton from './AddPageButton';
import ContextMenu from './ContextMenu';
import EditModal from './EditModal';

interface TabSystemProps {
  initialTabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}

const TabSystem: React.FC<TabSystemProps> = ({ initialTabs = [], onTabChange }) => {
  // Use the tab management hook
  const { 
    tabs, 
    setTabs, 
    handleAddTab: addTab, 
    handleTabClick, 
    handleDuplicateTab, 
    handleDeleteTab 
  } = useTabManagement({ initialTabs, onTabChange });
  
  // Use the custom drag and drop hook
  const { 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd, 
    handleDrop, 
    draggedTab 
  } = useDraggableTabs({ tabs, setTabs });
  
  // Use the add button hover hook
  const { 
    showAddButton, 
    setShowAddButton, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useAddButtonHover();
  
  // Use the context menu hook
  const { 
    contextMenu, 
    contextMenuRef, 
    handleIconClick, 
    hideContextMenu 
  } = useContextMenu() as {
    contextMenu: { visible: boolean; tabId: string; x: number; y: number };
    contextMenuRef: React.RefObject<HTMLDivElement>;
    handleIconClick: (e: React.MouseEvent, tabId: string) => void;
    hideContextMenu: () => void;
  };
  
  // Use the edit modal hook
  const { 
    editModal, 
    modalInputRef, 
    setEditModal, 
    handleTabRename, 
    handleModalKeyDown, 
    openEditModal 
  } = useEditModal({ tabs, setTabs }) as {
    editModal: { visible: boolean; tabId: string; title: string };
    modalInputRef: React.RefObject<HTMLInputElement>;
    setEditModal: React.Dispatch<React.SetStateAction<{ visible: boolean; tabId: string; title: string }>>;
    handleTabRename: () => void;
    handleModalKeyDown: (e: React.KeyboardEvent) => void;
    openEditModal: (tabId: string) => void;
  };
  
  // Use the context menu actions hook
  const { handleContextMenuAction } = useTabContextMenuActions({
    tabs,
    setTabs,
    openEditModal,
    handleDuplicateTab,
    handleDeleteTab,
    hideContextMenu
  });
  
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Wrapper for handleAddTab that also hides the add button
  const handleAddTab = (index: number) => {
    addTab(index);
    setShowAddButton(null);
  };

  return (
    <div className="w-full overflow-x-auto mt-2 border-gray-200" ref={tabsRef}>
      <div 
        className="flex items-center min-w-max relative"
        role="tablist"
        aria-label="Document tabs"
      >
        {/* Dashed line connecting all tabs - only as long as the tabs */}
        <div className="absolute top-1/2 border-b border-dashed border-gray-300 -z-10" 
          style={{
            left: '0',
            width: `${tabs.length * 100}px`, // Approximate width based on number of tabs
          }}
        ></div>
        
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            {/* Tab */}
            <TabItem
              tab={tab}
              index={index}
              draggedTab={draggedTab}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              handleDrop={handleDrop}
              handleTabClick={handleTabClick}
              handleIconClick={handleIconClick}
              tabsLength={tabs.length}
            />
            
            {/* Separator between tabs */}
            {index < tabs.length - 1 && (
              <TabSeparator
                index={index}
                showAddButton={showAddButton}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleAddTab={handleAddTab}
              />
            )}
          </React.Fragment>
        ))}
        
        {/* Add button for the end */}
        <AddTabButton
          tabsLength={tabs.length}
          showAddButton={showAddButton}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleAddTab={handleAddTab}
        />
        
        {/* Add page button */}
        <AddPageButton
          handleAddTab={handleAddTab}
          tabsLength={tabs.length}
        />
      </div>
      
      {/* Edit Tab Modal */}
      <EditModal
        editModal={editModal}
        modalInputRef={modalInputRef}
        setEditModal={setEditModal}
        handleTabRename={handleTabRename}
        handleModalKeyDown={handleModalKeyDown}
      />
      
      {/* Context Menu */}
      <ContextMenu
        contextMenu={contextMenu}
        contextMenuRef={contextMenuRef}
        handleContextMenuAction={handleContextMenuAction}
      />
    </div>
  );
};

export default TabSystem;
