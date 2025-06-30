import React from 'react';
import Image from 'next/image';
import { Tab } from '@/hooks/useDraggableTabs';
import TabIcon from './TabIcon';

interface TabItemProps {
  tab: Tab;
  index: number;
  draggedTab: Tab | null;
  handleDragStart: (e: React.DragEvent<HTMLButtonElement>, tab: Tab, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLButtonElement>, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent<HTMLButtonElement>) => void;
  handleTabClick: (tabId: string) => void;
  handleIconClick: (e: React.MouseEvent, tabId: string) => void;
  tabsLength: number;
}

const TabItem: React.FC<TabItemProps> = ({
  tab,
  index,
  draggedTab,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
  handleTabClick,
  handleIconClick,
  tabsLength
}) => {
  return (
    <button 
      type="button"
      role="tab"
      aria-selected={tab.isActive}
      aria-controls={`tabpanel-${tab.id}`}
      id={`tab-${tab.id}`}
      tabIndex={0}
      className={`px-3 py-1 cursor-pointer select-none transition-colors flex
         focus:outline-blue-200 border border-gray-300
        items-center z-10 rounded text-sm ${
        tab.isActive 
        ? 'text-black font-medium bg-white border border-gray-300 hover:bg-white' 
        : 'text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
      } ${draggedTab && draggedTab.id === tab.id ? 'opacity-0' : 'opacity-100'}`}
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
        else if (e.key === 'ArrowRight' && index < tabsLength - 1) {
          e.preventDefault();
          const nextTabId = `tab-${parseInt(tab.id) + 1}`;
          handleTabClick(nextTabId);
          document.getElementById(nextTabId)?.focus();
        }
        else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          const prevTabId = `tab-${parseInt(tab.id) - 1}`;
          handleTabClick(prevTabId);
          document.getElementById(prevTabId)?.focus();
        }
      }}
    >
      <TabIcon icon={tab.icon} />
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
  );
};

export default TabItem;
