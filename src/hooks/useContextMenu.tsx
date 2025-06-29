import { useState, useRef, useEffect } from 'react';

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
  tabId: string;
}

interface UseContextMenuReturn {
  contextMenu: ContextMenuState;
  contextMenuRef: React.RefObject<HTMLDivElement | null>;
  handleIconClick: (e: React.MouseEvent, tabId: string) => void;
  hideContextMenu: () => void;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
}

/**
 * Custom hook for managing context menu state and behavior
 */
const useContextMenu = (): UseContextMenuReturn => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ 
    x: 0, 
    y: 0, 
    visible: false, 
    tabId: '' 
  });
  
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent tab activation
    
    // Get the tab element to position the menu above it
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (tabElement) {
      const tabRect = tabElement.getBoundingClientRect();
      
      // Position the menu above the left side of the tab list item
      setContextMenu({
        x: tabRect.left, // Position at the left edge of the tab
        y: tabRect.top, // Position at the top of the tab, margin will handle the gap
        visible: true,
        tabId
      });
    } else {
      // Fallback to click position if tab element not found
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        visible: true,
        tabId
      });
    }
  };

  const hideContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        hideContextMenu();
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  return {
    contextMenu,
    contextMenuRef,
    handleIconClick,
    hideContextMenu,
    setContextMenu
  };
};

export default useContextMenu;
