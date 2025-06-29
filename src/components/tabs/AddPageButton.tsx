import React from 'react';

interface AddPageButtonProps {
  handleAddTab: (index: number) => void;
  tabsLength: number;
}

const AddPageButton: React.FC<AddPageButtonProps> = ({ handleAddTab, tabsLength }) => {
  return (
    <div className="ml-4 flex items-center">
      <button 
        className="focus:outline-blue-200 focus:shadow-xs px-3 py-1 text-gray-600 border border-gray-300 rounded flex items-center gap-1.5 text-sm hover:bg-gray-50 bg-white"
        onClick={() => handleAddTab(tabsLength)}
        aria-label="Add new page"
        type="button"
      >
        <span aria-hidden="true" className="text-sm font-medium">+</span> Add page
      </button>
    </div>
  );
};

export default AddPageButton;
