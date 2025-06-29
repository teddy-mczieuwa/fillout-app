'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
// Using Tailwind CSS for styling

import useDraggableTabs from '@/hooks/useDraggableTabs';
import useTabManagement from '@/hooks/useTabManagement';
import useContextMenu from '@/hooks/useContextMenu';
import useEditModal from '@/hooks/useEditModal';
import useAddButtonHover from '@/hooks/useAddButtonHover';

// Tab interface is now imported from useDraggableTabs
import { Tab } from '@/hooks/useDraggableTabs';

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
  } = useContextMenu();
  
  // Use the edit modal hook
  const { 
    editModal, 
    modalInputRef, 
    setEditModal, 
    handleTabRename, 
    handleModalKeyDown, 
    openEditModal 
  } = useEditModal({ tabs, setTabs });
  
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Wrapper for handleAddTab that also hides the add button
  const handleAddTab = (index: number) => {
    addTab(index);
    setShowAddButton(null);
  };
  
  // Handle context menu actions
  const handleContextMenuAction = (action: string, tabId: string) => {
    switch(action) {
      case 'rename':
        openEditModal(tabId);
        break;
      case 'duplicate':
        handleDuplicateTab(tabId);
        break;
      case 'delete':
        handleDeleteTab(tabId);
        break;
      default:
        break;
    }
    // Close the context menu after action
    hideContextMenu();
  };

  return (
    <div className="w-full overflow-x-auto mt-2 border-gray-200" ref={tabsRef}>
      <div className="flex items-center min-w-max relative">
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
            <div tabIndex={0} 
              className={`px-3 py-1 cursor-pointer select-none transition-colors flex focus:outline-red-200
                items-center z-10 bg-gray-200 hover:bg-gray-300 rounded text-sm ${
                tab.isActive 
                ? 'text-black font-medium bg-white border border-gray-300 hover:bg-white' 
                : 'text-gray-500 hover:text-gray-700'
              } ${draggedTab && draggedTab.id === tab.id ? 'opacity-0' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, tab, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e)}
              onClick={() => handleTabClick(tab.id)}
            >
              
              <Image src="icons/file.svg" alt="" width={16} height={16} className="mr-1" />

              {tab.title} 

              {tab.isActive && (
                <Image 
                  src="icons/dotgrid.svg" 
                  alt="" 
                  width={16}
                  height={16}
                  className="cursor-pointer ml-1"
                  onClick={(e) => handleIconClick(e, tab.id)}
                />
              )}
            </div>
            
            {/* Separator between tabs */}
            {index < tabs.length - 1 && (
              <div 
                className="relative h-full flex items-center justify-center"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave()}
              >
                <div className="border-b border-dashed border-gray-300 w-4 mx-2"></div>
                {showAddButton === index && (
                  <button 
                    className="absolute w-4 h-4 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-white"
                    onClick={() => handleAddTab(index + 1)}
                  >
                    +
                  </button>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        
        {/* Add button for the end */}
        <div 
          className="relative h-full flex items-center justify-center"
          onMouseEnter={() => handleMouseEnter(tabs.length)}
          onMouseLeave={() => handleMouseLeave()}
        >
          {showAddButton === tabs.length && (
            <button 
              className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-gray-200"
              onClick={() => handleAddTab(tabs.length)}
            >
              +
            </button>
          )}
        </div>
        
        {/* Add page button */}
        <div className="ml-4 flex items-center">
          <button className="focus:outline-red-200 px-3 py-1 text-gray-600 border border-gray-300 rounded flex items-center gap-1.5 text-sm hover:bg-gray-50 bg-white"
          onClick={() => handleAddTab(tabs.length)}
          >
            <span className="text-sm font-medium">+</span> Add page
          </button>
        </div>
      </div>
      
      {/* Edit Tab Modal */}
      {editModal.visible && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setEditModal({ ...editModal, visible: false })}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">Rename Tab</h3>
            <div className="mb-4">
              <input
                ref={modalInputRef}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editModal.title}
                onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
                onKeyDown={handleModalKeyDown}
                placeholder="Tab name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setEditModal({ ...editModal, visible: false })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleTabRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          ref={contextMenuRef}
          className="absolute bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px`,
            minWidth: '150px'
          }}
        >
          <div 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            onClick={() => handleContextMenuAction('rename', contextMenu.tabId)}
          >
            <span className="text-sm">Rename</span>
          </div>
          <div 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            onClick={() => handleContextMenuAction('duplicate', contextMenu.tabId)}
          >
            <span className="text-sm">Duplicate</span>
          </div>
          <div 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
            onClick={() => handleContextMenuAction('delete', contextMenu.tabId)}
          >
            <span className="text-sm">Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSystem;
