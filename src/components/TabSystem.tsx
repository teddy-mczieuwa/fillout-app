'use client';

import React, { useState, useRef, useEffect } from 'react';
// Using Tailwind CSS for styling

interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
}

interface TabSystemProps {
  initialTabs?: Tab[];
}

const TabSystem: React.FC<TabSystemProps> = ({ initialTabs = [] }) => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    { id: '1', title: 'Info', isActive: true },
    { id: '2', title: 'Details' },
    { id: '3', title: 'Other' },
    { id: '4', title: 'Ending' },
  ]);
  
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [showAddButton, setShowAddButton] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null);

  // Create a drag image element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.className = 'p-2 bg-gray-100 border border-gray-300 rounded shadow-md opacity-80';
      div.style.position = 'absolute';
      div.style.top = '-1000px';
      div.style.opacity = '0.8';
      document.body.appendChild(div);
      setDragImage(div);

      return () => {
        document.body.removeChild(div);
      };
    }
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => {
    setDraggedTab(tab);
    
    // Set custom drag image
    if (dragImage) {
      dragImage.textContent = tab.title;
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedTab && draggedOverIndex !== index) {
      setDraggedOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
    setDraggedOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (!draggedTab) return;

    const draggedTabIndex = tabs.findIndex(t => t.id === draggedTab.id);
    if (draggedTabIndex === dropIndex) return;

    const newTabs = [...tabs];
    newTabs.splice(draggedTabIndex, 1);
    newTabs.splice(dropIndex, 0, draggedTab);
    
    setTabs(newTabs);
    setDraggedTab(null);
    setDraggedOverIndex(null);
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

  return (
    <div className="w-full overflow-x-auto border-b border-gray-200" ref={tabsRef}>
      <div className="flex items-center min-w-max">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            {/* Tab */}
            <div 
              className={`px-4 py-2 cursor-pointer select-none mr-1 transition-colors flex items-center ${tab.isActive 
                ? 'text-black border-b-2 border-b-black font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
              draggable
              onDragStart={(e) => handleDragStart(e, tab, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.title}
            </div>
            
            {/* Separator between tabs */}
            {index < tabs.length - 1 && (
              <div 
                className="relative h-full flex items-center justify-center"
                onMouseEnter={() => setShowAddButton(index)}
                onMouseLeave={() => setShowAddButton(null)}
              >
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
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
          className="relative h-full flex items-center justify-center ml-1"
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
        <div className="ml-4">
          <button className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1">
            <span className="text-xs">+</span> Add page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSystem;
