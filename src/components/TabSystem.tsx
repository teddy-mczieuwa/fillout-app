'use client';

import React, { useState, useRef, useEffect } from 'react';
// Using Tailwind CSS for styling

interface Tab {
  id: string;
  isActive?: boolean;
  isDefault?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  title: string;
}

interface TabSystemProps {
  initialTabs?: Tab[];
}

const TabSystem: React.FC<TabSystemProps> = ({ initialTabs = [] }) => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    { id: '1', title: 'Info', isActive: true, isDefault: true, isHovered: false, isFocused: false },
    { id: '2', title: 'Details', isDefault: false, isHovered: false, isFocused: false },
    { id: '3', title: 'Other', isDefault: false, isHovered: false, isFocused: false },
    { id: '4', title: 'Ending', isDefault: false, isHovered: false, isFocused: false },
  ]);
  
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [showAddButton, setShowAddButton] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, tabId: string }>({ x: 0, y: 0, visible: false, tabId: '' });
  const tabsRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Create a custom drag ghost element
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => {
    setDraggedTab(tab);
    setDraggedTabIndex(index);
    
    // Store initial mouse position to calculate horizontal movement only
    const initialX = e.clientX;
    const initialY = e.clientY;
    
    // Store the initial position in the dataTransfer object
    e.dataTransfer.setData('initialX', initialX.toString());
    e.dataTransfer.setData('initialY', initialY.toString());
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Create a custom drag image
    const dragGhost = e.currentTarget.cloneNode(true) as HTMLElement;
    dragGhost.style.width = `${e.currentTarget.offsetWidth}px`;
    dragGhost.style.height = `${e.currentTarget.offsetHeight}px`;
    dragGhost.style.opacity = '0.7';
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-1000px';
    dragGhost.style.left = '-1000px';
    dragGhost.style.pointerEvents = 'none';
    
    document.body.appendChild(dragGhost);
    
    // Set the custom drag image
    e.dataTransfer.setDragImage(dragGhost, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    e.dataTransfer.effectAllowed = 'move';
    
    // Clean up the ghost element after the drag operation
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    
    // Only update the draggedOverIndex if the movement is primarily horizontal
    if (draggedTab && draggedTabIndex !== null && draggedOverIndex !== index) {
      const initialX = parseInt(e.dataTransfer.getData('initialX') || '0');
      const initialY = parseInt(e.dataTransfer.getData('initialY') || '0');
      
      const deltaX = Math.abs(e.clientX - initialX);
      const deltaY = Math.abs(e.clientY - initialY);
      
      // If horizontal movement is greater than vertical movement, update the index
      if (deltaX > deltaY) {
        setDraggedOverIndex(index);
        
        // Reorder tabs in real-time during drag
        if (index !== draggedTabIndex) {
          const newTabs = [...tabs];
          const draggedItem = newTabs[draggedTabIndex];
          
          // Remove the dragged item
          newTabs.splice(draggedTabIndex, 1);
          
          // Insert at the new position
          newTabs.splice(index, 0, draggedItem);
          
          // Update the dragged tab index to its new position
          setDraggedTabIndex(index);
          
          // Update the tabs array
          setTabs(newTabs);
        }
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
    setDraggedOverIndex(null);
    setDraggedTabIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Since we're already moving tabs in real-time during drag,
    // we just need to reset the state variables here
    setDraggedTab(null);
    setDraggedOverIndex(null);
    setDraggedTabIndex(null);
  };

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
        // Implement rename functionality
        const newTitle = prompt('Enter new tab name:', tabs.find(tab => tab.id === tabId)?.title);
        if (newTitle) {
          setTabs(tabs.map(tab => tab.id === tabId ? { ...tab, title: newTitle } : tab));
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

  return (
    <div className="w-full overflow-x-auto border-b border-gray-200" ref={tabsRef}>
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
            <div 
              className={`px-3 py-1 cursor-pointer select-none transition-colors flex items-center border border-gray-300 z-10 bg-gray-300 rounded text-sm ${
                tab.isActive 
                ? 'text-black border-b-2 border-b-black font-medium bg-white' 
                : 'text-gray-500 hover:text-gray-700'
              } ${draggedTab && draggedTab.id === tab.id ? 'opacity-0' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, tab, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e)}
              onClick={() => handleTabClick(tab.id)}
            >
              
              <img src="circle-check,%20check%20radio,%20circle,%20checkbox,%20check,%20checkmark,%20confirm.svg" alt="" />

              {tab.title} 

              {tab.isActive && (
                <img 
                  src="dotgrid.svg" 
                  alt="" 
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
                    className="absolute w-5 h-5 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-gray-200"
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
          <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded flex items-center gap-1.5 text-sm hover:bg-gray-50 bg-white"
          onClick={() => handleAddTab(tabs.length)}
          >
            <span className="text-sm font-medium">+</span> Add page
          </button>
        </div>
      </div>
      
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
