import React from 'react';

interface AddTabButtonProps {
  tabsLength: number;
  showAddButton: number | null;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  handleAddTab: (index: number) => void;
}

const AddTabButton: React.FC<AddTabButtonProps> = ({
  tabsLength,
  showAddButton,
  handleMouseEnter,
  handleMouseLeave,
  handleAddTab
}) => {
  return (
    <div 
      className="relative h-full flex items-center justify-center"
      onMouseEnter={() => handleMouseEnter(tabsLength)}
      onMouseLeave={() => handleMouseLeave()}
    >
      {showAddButton === tabsLength && (
        <button 
          className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-gray-200"
          onClick={() => handleAddTab(tabsLength)}
          aria-label="Add tab at the end"
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
      )}
    </div>
  );
};

export default AddTabButton;
