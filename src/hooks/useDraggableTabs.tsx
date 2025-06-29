import { useState, useCallback, useMemo } from 'react';

/**
 * Tab interface representing a tab item
 */
export interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
  isDefault?: boolean;
}

/**
 * Coordinates type for tracking drag position
 */
type Coordinates = {
  x: number;
  y: number;
};

/**
 * Props for the useDraggableTabs hook
 */
export interface UseDraggableTabsProps {
  /** Array of tabs to be managed */
  tabs: Tab[];
  /** State setter function for tabs */
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  /** Optional threshold for determining horizontal vs vertical movement (default: 1.2) */
  horizontalThreshold?: number;
}

/**
 * Return type for the useDraggableTabs hook
 */
export interface DragHandlers {
  /** Handler for starting drag operation */
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => void;
  /** Handler for dragging over a drop target */
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  /** Handler for ending drag operation */
  handleDragEnd: () => void;
  /** Handler for dropping on a target */
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Currently dragged tab or null if no drag in progress */
  draggedTab: Tab | null;
}

/**
 * Creates a custom drag ghost element for drag operations
 */
const createDragGhost = (element: HTMLElement): HTMLElement => {
  const dragGhost = element.cloneNode(true) as HTMLElement;
  
  // Style the ghost element
  Object.assign(dragGhost.style, {
    width: `${element.offsetWidth}px`,
    height: `${element.offsetHeight}px`,
    opacity: '0.7',
    position: 'absolute',
    top: '-1000px',
    left: '-1000px',
    pointerEvents: 'none',
  });
  
  return dragGhost;
};

/**
 * Determines if movement is primarily horizontal based on deltas
 */
const isHorizontalMovement = (deltaX: number, deltaY: number, threshold = 1.2): boolean => {
  return deltaX > deltaY / threshold;
};

/**
 * Custom hook for making tabs draggable and reorderable
 * 
 * @param props - The hook properties
 * @returns Object containing drag handlers and current drag state
 */
const useDraggableTabs = ({
  tabs,
  setTabs,
  horizontalThreshold = 1.2,
}: UseDraggableTabsProps): DragHandlers => {
  // State for tracking drag operations
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [dragStartCoords, setDragStartCoords] = useState<Coordinates | null>(null);

  /**
   * Resets all drag-related state
   */
  const resetDragState = useCallback(() => {
    setDraggedTab(null);
    setDraggedOverIndex(null);
    setDraggedTabIndex(null);
    setDragStartCoords(null);
  }, []);

  /**
   * Handles the start of a drag operation
   */
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => {
    try {
      setDraggedTab(tab);
      setDraggedTabIndex(index);
      
      // Store initial mouse position to calculate horizontal movement only
      setDragStartCoords({ x: e.clientX, y: e.clientY });
      
      // Store the tab index in the dataTransfer object
      e.dataTransfer.setData('text/plain', index.toString());
      
      // Create and set up a custom drag ghost
      const dragGhost = createDragGhost(e.currentTarget);
      document.body.appendChild(dragGhost);
      
      // Set the custom drag image
      e.dataTransfer.setDragImage(dragGhost, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      e.dataTransfer.effectAllowed = 'move';
      
      // Clean up the ghost element after the drag operation
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

  /**
   * Handles dragging over a potential drop target
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    
    // Only update if we have all the necessary state and the index has changed
    if (!draggedTab || draggedTabIndex === null || !dragStartCoords || draggedOverIndex === index) {
      return;
    }
    
    try {
      // Calculate movement deltas
      const deltaX = Math.abs(e.clientX - dragStartCoords.x);
      const deltaY = Math.abs(e.clientY - dragStartCoords.y);
      
      // Only proceed if movement is primarily horizontal
      if (isHorizontalMovement(deltaX, deltaY, horizontalThreshold)) {
        setDraggedOverIndex(index);
        
        // Reorder tabs in real-time during drag if index changed
        if (index !== draggedTabIndex) {
          const newTabs = [...tabs];
          const draggedItem = newTabs[draggedTabIndex];
          
          // Remove the dragged item and insert at new position
          newTabs.splice(draggedTabIndex, 1);
          newTabs.splice(index, 0, draggedItem);
          
          // Update the dragged tab index to its new position
          setDraggedTabIndex(index);
          
          // Update the tabs array
          setTabs(newTabs);
        }
      }
    } catch (error) {
      console.error('Error in drag over:', error);
    }
  }, [draggedTab, draggedTabIndex, draggedOverIndex, dragStartCoords, tabs, setTabs, horizontalThreshold]);

  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  /**
   * Handles dropping on a target
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    resetDragState();
  }, [resetDragState]);

  // Memoize the returned handlers to prevent unnecessary re-renders
  return useMemo(() => ({
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    draggedTab
  }), [handleDragStart, handleDragOver, handleDragEnd, handleDrop, draggedTab]);
};

export default useDraggableTabs;