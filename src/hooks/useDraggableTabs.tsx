import { useState } from "react";


interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
  isDefault?: boolean;
}

// Custom hook for drag and drop functionality
interface UseDraggableTabsProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

interface DragHandlers {
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  draggedTab: Tab | null;
}

const useDraggableTabs = ({ tabs, setTabs }: UseDraggableTabsProps): DragHandlers => {
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [dragStartCoords, setDragStartCoords] = useState<{x: number, y: number} | null>(null);

  // Create a custom drag ghost element
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tab: Tab, index: number) => {
    setDraggedTab(tab);
    setDraggedTabIndex(index);
    
    // Store initial mouse position to calculate horizontal movement only
    const initialX = e.clientX;
    const initialY = e.clientY;
    setDragStartCoords({ x: initialX, y: initialY });
    
    // Store the tab index in the dataTransfer object
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
    if (draggedTab && draggedTabIndex !== null && draggedOverIndex !== index && dragStartCoords) {
      const deltaX = Math.abs(e.clientX - dragStartCoords.x);
      const deltaY = Math.abs(e.clientY - dragStartCoords.y);
      
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
    setDragStartCoords(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Since we're already moving tabs in real-time during drag,
    // we just need to reset the state variables here
    setDraggedTab(null);
    setDraggedOverIndex(null);
    setDraggedTabIndex(null);
    setDragStartCoords(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    draggedTab
  };
};

export default useDraggableTabs;