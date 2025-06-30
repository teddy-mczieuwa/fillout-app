import { useState, useCallback, useMemo } from 'react';

export interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
  isDefault?: boolean;
  icon?: string;
}

type Coordinates = {
  x: number;
  y: number;
};

export interface UseDraggableTabsProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  horizontalThreshold?: number;
}

export interface DragHandlers {
  handleDragStart: (e: React.DragEvent<HTMLElement>, tab: Tab, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  draggedTab: Tab | null;
}

const createDragGhost = (element: HTMLElement): HTMLElement => {
  const dragGhost = element.cloneNode(true) as HTMLElement;
  
  Object.assign(dragGhost.style, {
    width: `${element.offsetWidth}px`,
    height: `${element.offsetHeight}px`,
    opacity: '1',
    position: 'absolute',
    top: '-1000px',
    left: '-1000px',
    pointerEvents: 'none',
  });
  
  return dragGhost;
};

const isHorizontalMovement = (deltaX: number, deltaY: number, threshold = 1.2): boolean => {
  return deltaX > deltaY / threshold;
};


const useDraggableTabs = ({
  tabs,
  setTabs,
  horizontalThreshold = 1.2,
}: UseDraggableTabsProps): DragHandlers => {
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [dragStartCoords, setDragStartCoords] = useState<Coordinates | null>(null);

  const resetDragState = useCallback(() => {
    setDraggedTab(null);
    setDraggedOverIndex(null);
    setDraggedTabIndex(null);
    setDragStartCoords(null);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLElement>, tab: Tab, index: number) => {
    try {
      setDraggedTab(tab);
      setDraggedTabIndex(index);
      
      setDragStartCoords({ x: e.clientX, y: e.clientY });
      
      e.dataTransfer.setData('text/plain', index.toString());
      
      const dragGhost = createDragGhost(e.currentTarget);
      document.body.appendChild(dragGhost);
      
      e.dataTransfer.setDragImage(dragGhost, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      e.dataTransfer.effectAllowed = 'move';
      
      setTimeout(() => {
        if (document.body.contains(dragGhost)) {
          document.body.removeChild(dragGhost);
        }
      }, 0);
    } catch (error) {
      console.error('Error in drag start:', error);
      resetDragState();
    }
  }, [resetDragState]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    
    if (!draggedTab || draggedTabIndex === null || !dragStartCoords || draggedOverIndex === index) {
      return;
    }
    
    try {
      const deltaX = Math.abs(e.clientX - dragStartCoords.x);
      const deltaY = Math.abs(e.clientY - dragStartCoords.y);
      
      if (isHorizontalMovement(deltaX, deltaY, horizontalThreshold)) {
        setDraggedOverIndex(index);
        
        if (index !== draggedTabIndex) {
          const newTabs = [...tabs];
          const draggedItem = newTabs[draggedTabIndex];
          
          newTabs.splice(draggedTabIndex, 1);
          newTabs.splice(index, 0, draggedItem);
          
          setDraggedTabIndex(index);
          
          setTabs(newTabs);
        }
      }
    } catch (error) {
      console.error('Error in drag over:', error);
    }
  }, [draggedTab, draggedTabIndex, draggedOverIndex, dragStartCoords, tabs, setTabs, horizontalThreshold]);

  const handleDragEnd = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  
  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    resetDragState();
  }, [resetDragState]);

  return useMemo(() => ({
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    draggedTab
  }), [handleDragStart, handleDragOver, handleDragEnd, handleDrop, draggedTab]);
};

export default useDraggableTabs;