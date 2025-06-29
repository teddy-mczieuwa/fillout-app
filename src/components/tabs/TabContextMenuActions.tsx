import React from 'react';
import Image from 'next/image';

interface TabContextMenuActionsProps {
  action: string;
  label: string;
  icon: string;
  onClick: () => void;
}

const TabContextMenuActions: React.FC<TabContextMenuActionsProps> = ({
  action,
  label,
  icon,
  onClick
}) => {
  return (
    <button
      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
      onClick={onClick}
      data-action={action}
      role="menuitem"
    >
      <div className="w-5 h-5 mr-3 flex items-center justify-center">
        <Image src={`icons/${icon}`} alt="" width={16} height={16} />
      </div>
      {label}
    </button>
  );
};

export default TabContextMenuActions;
