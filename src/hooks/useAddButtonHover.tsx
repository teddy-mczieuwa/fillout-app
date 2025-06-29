import { useState } from 'react';

interface UseAddButtonHoverReturn {
  showAddButton: number | null;
  setShowAddButton: React.Dispatch<React.SetStateAction<number | null>>;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
}

/**
 * Custom hook for managing add button hover state
 */
const useAddButtonHover = (): UseAddButtonHoverReturn => {
  const [showAddButton, setShowAddButton] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setShowAddButton(index);
  };

  const handleMouseLeave = () => {
    setShowAddButton(null);
  };

  return {
    showAddButton,
    setShowAddButton,
    handleMouseEnter,
    handleMouseLeave
  };
};

export default useAddButtonHover;
