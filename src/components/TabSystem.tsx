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
  

  const renderIcon = (icon?: string) => {
    const iconSrc = icon === 'info.svg' || icon === 'check.svg' ? icon : 'file.svg';
    const altText = icon === 'info.svg' ? 'Info icon' : icon === 'check.svg' ? 'Check icon' : 'File icon';
    return <Image src={`icons/${iconSrc}`} alt={altText} className="mr-1" width={16} height={16} />;
  };

  // Handle context menu actions
  const handleContextMenuAction = (action: string, tabId: string) => {
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
            <button 
              type="button"
              role="tab"
              aria-selected={tab.isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={0}
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
              onKeyDown={(e) => {
                // Select tab with Enter or Space
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick(tab.id);
                }
                // Allow arrow key navigation between tabs
                else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
                  e.preventDefault();
                  const nextTabId = tabs[index + 1].id;
                  handleTabClick(nextTabId);
                  document.getElementById(`tab-${nextTabId}`)?.focus();
                }
                else if (e.key === 'ArrowLeft' && index > 0) {
                  e.preventDefault();
                  const prevTabId = tabs[index - 1].id;
                  handleTabClick(prevTabId);
                  document.getElementById(`tab-${prevTabId}`)?.focus();
                }
              }}
            >

              {renderIcon(tab.icon)}
             

              <span>{tab.title}</span> 

              {tab.isActive && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Options for ${tab.title} tab`}
                  className="flex items-center justify-center ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent button
                    handleIconClick(e, tab.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      // Create a synthetic MouseEvent since handleIconClick expects a MouseEvent
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      const syntheticEvent = {
                        clientX: rect.left,
                        clientY: rect.top,
                        preventDefault: () => {},
                        stopPropagation: () => {}
                      } as unknown as React.MouseEvent;
                      handleIconClick(syntheticEvent, tab.id);
                    }
                  }}
                >
                  <Image 
                    src="icons/dotgrid.svg" 
                    alt="" 
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </button>
            
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
                    className="absolute w-4 h-4 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handleAddTab(index + 1)}
                    aria-label="Add tab after this tab"
                    type="button"
                  >
                    <span aria-hidden="true">+</span>
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
              aria-label="Add tab at the end"
              type="button"
            >
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
        
        {/* Add page button */}
        <div className="ml-4 flex items-center">
          <button 
            className="focus:outline-blue-200 focus:shadow-xs px-3 py-1 text-gray-600 border border-gray-300 rounded flex items-center gap-1.5 text-sm hover:bg-gray-50 bg-white"
            onClick={() => handleAddTab(tabs.length)}
            aria-label="Add new page"
            type="button"
          >
            <span aria-hidden="true" className="text-sm font-medium">+</span> Add page
          </button>
        </div>
      </div>
      
      {/* Edit Tab Modal */}
      {editModal.visible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setEditModal({ ...editModal, visible: false })}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" className="text-lg font-medium mb-4">Rename Tab</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleTabRename(); }}>
              <div className="mb-4">
                <label htmlFor="tab-name" className="sr-only">Tab name</label>
                <input
                  ref={modalInputRef}
                  id="tab-name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editModal.title}
                  onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
                  onKeyDown={handleModalKeyDown}
                  placeholder="Tab name"
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                  onClick={() => setEditModal({ ...editModal, visible: false })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          ref={contextMenuRef}
          className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-50"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px`,
            minWidth: '200px',
            transform: 'translateY(-100%)', // Position above without horizontal shift
            marginTop: '-20px' // Exactly 20px above the tab
          }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`tab-${contextMenu.tabId}`}
        >
          <div className="p-3 pb-2 border-b border-gray-100">
            <h3 className="text-base font-medium">Settings</h3>
          </div>
          
          <div className="py-1">
            {/* Set as first page */}
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 focus:outline-none focus:bg-gray-100"
              onClick={() => handleContextMenuAction('setFirst', contextMenu.tabId)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 24V0H14L20 6V24H4Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M14 0V6H20M4 24V0H14L20 6V24H4Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>Set as first page</span>
            </button>
            
            {/* Rename */}
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 focus:outline-none focus:bg-gray-100"
              onClick={() => handleContextMenuAction('rename', contextMenu.tabId)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9 6.85786L17.1421 11.1L7.24264 21H3V16.7574L12.9 6.85786Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M12.9 6.85786L17.1421 11.1M12.9 6.85786L16.0711 3.68629C16.8513 2.90625 18.1077 2.90625 18.8878 3.68629L20.3137 5.1122C21.0938 5.89224 21.0938 7.14861 20.3137 7.92865L17.1421 11.1M12.9 6.85786L3 16.7574V21H7.24264L17.1421 11.1" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>Rename</span>
            </button>
            
            {/* Copy */}
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 focus:outline-none focus:bg-gray-100"
              onClick={() => handleContextMenuAction('copy', contextMenu.tabId)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 8V4H20V16H16M4 8H16V20H4V8Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M8 8V4H20V16H16M4 8H16V20H4V8Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>Copy</span>
            </button>
            
            {/* Duplicate */}
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 focus:outline-none focus:bg-gray-100"
              onClick={() => handleContextMenuAction('duplicate', contextMenu.tabId)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 16V4H4V16H16Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M8 8H20V20H8V8Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M16 16V4H4V16H16ZM16 16H20V20H8V16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>Duplicate</span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>
          
          {/* Delete */}
          <div className="py-1">
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 focus:outline-none focus:bg-gray-100"
              onClick={() => handleContextMenuAction('delete', contextMenu.tabId)}
              role="menuitem"
              tabIndex={0}
            >
              <span className="text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8H19L18 21H6L5 8Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M10 11V17M14 11V17M21 6H3M16 6L15.7294 4.58818C15.4671 3.3293 14.3562 2.5 13.0716 2.5H10.9284C9.64384 2.5 8.53292 3.3293 8.27065 4.58818L8 6M5 6H19L18 21H6L5 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-red-500">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSystem;
