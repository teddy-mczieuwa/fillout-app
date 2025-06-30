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
    
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (tabElement) {
      const tabRect = tabElement.getBoundingClientRect();
      
      setContextMenu({
        x: tabRect.left, 
        y: tabRect.top, 
        visible: true,
        tabId
      });
    } else {
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
