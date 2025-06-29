'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
// Using Tailwind CSS for styling

import useDraggableTabs from '@/hooks/useDraggableTabs';

interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
  isDefault?: boolean;
}

interface TabSystemProps {
  initialTabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}



const TabSystem: React.FC<TabSystemProps> = ({ initialTabs = [], onTabChange }) => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    { id: '1', title: 'Info', isActive: true, isDefault: true,  },
    { id: '2', title: 'Details', isDefault: false,  },
    { id: '3', title: 'Other', isDefault: false,  },
    { id: '4', title: 'Ending', isDefault: false, },
  ]);
  
  // Use the custom drag and drop hook
  const { handleDragStart, handleDragOver, handleDragEnd, handleDrop, draggedTab } = useDraggableTabs({ tabs, setTabs });
  
  const [showAddButton, setShowAddButton] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, tabId: string }>({ x: 0, y: 0, visible: false, tabId: '' });
  const [editModal, setEditModal] = useState<{ visible: boolean, tabId: string, title: string }>({ visible: false, tabId: '', title: '' });
  const tabsRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  const handleAddTab = (index: number) => {
    const newTabId = String(Math.max(...tabs.map(t => parseInt(t.id))) + 1);
    const newTab: Tab = { id: newTabId, title: `New Tab` };
    
    const newTabs = [...tabs];
    newTabs.splice(index, 0, newTab);
    
    setTabs(newTabs);
    setShowAddButton(null);
  };

  const handleTabClick = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    
    // Notify parent component about tab change
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleIconClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent tab activation
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      tabId
    });
  };

  const handleContextMenuAction = (action: string, tabId: string) => {
    switch(action) {
      case 'rename':
        // Open the edit modal instead of using prompt
        const tabToEdit = tabs.find(tab => tab.id === tabId);
        if (tabToEdit) {
          setEditModal({
            visible: true,
            tabId: tabId,
            title: tabToEdit.title
          });
        }
        break;
      case 'duplicate':
        // Implement duplicate functionality
        const tabToDuplicate = tabs.find(tab => tab.id === tabId);
        if (tabToDuplicate) {
          const newTabId = String(Math.max(...tabs.map(t => parseInt(t.id))) + 1);
          const newTab: Tab = { ...tabToDuplicate, id: newTabId, title: `${tabToDuplicate.title} (Copy)`, isActive: false };
          const tabIndex = tabs.findIndex(tab => tab.id === tabId);
          const newTabs = [...tabs];
          newTabs.splice(tabIndex + 1, 0, newTab);
          setTabs(newTabs);
        }
        break;
      case 'delete':
        // Implement delete functionality
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
        break;
      default:
        break;
    }
    // Close the context menu after action
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Handle tab rename submission
  const handleTabRename = () => {
    if (editModal.title.trim()) {
      setTabs(tabs.map(tab => tab.id === editModal.tabId ? { ...tab, title: editModal.title } : tab));
      setEditModal({ ...editModal, visible: false });
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

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
      setEditModal({ ...editModal, visible: false });
    }
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
                ? 'text-black font-medium bg-white border border-gray-300' 
                : 'text-gray-500 hover:text-gray-700'
              } ${draggedTab && draggedTab.id === tab.id ? 'opacity-0' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, tab, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e)}
              onClick={() => handleTabClick(tab.id)}
            >
              
              <Image src="/file.svg" alt="" width={16} height={16} className="mr-1" />

              {tab.title} 

              {tab.isActive && (
                <Image 
                  src="/dotgrid.svg" 
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
                onMouseEnter={() => setShowAddButton(index)}
                onMouseLeave={() => setShowAddButton(null)}
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
          onMouseEnter={() => setShowAddButton(tabs.length)}
          onMouseLeave={() => setShowAddButton(null)}
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
