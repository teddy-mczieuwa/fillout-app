import React from 'react';

interface TabSeparatorProps {
  index: number;
  showAddButton: number | null;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  handleAddTab: (index: number) => void;
}

const TabSeparator: React.FC<TabSeparatorProps> = ({
  index,
  showAddButton,
  handleMouseEnter,
  handleMouseLeave,
  handleAddTab
}) => {
  return (
    <div 
      className="relative h-full flex items-center justify-center"
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={() => handleMouseLeave()}
    >
      <div className="border-b border-dashed border-gray-300 w-4 mx-2"></div>
      {showAddButton === index && (
        <button 
          className="absolute w-4 h-4 rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center justify-center cursor-pointer text-base hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleAddTab(index + 1)}
          aria-label="Add tab after this tab"
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
      )}
    </div>
  );
};

export default TabSeparator;
