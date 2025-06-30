import React from 'react';
import TabContextMenuActions from './TabContextMenuActions';

interface ContextMenuProps {
  contextMenu: {
    visible: boolean;
    tabId: string;
    x: number;
    y: number;
  };
  contextMenuRef: React.RefObject<HTMLDivElement>;
  handleContextMenuAction: (action: string, tabId: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  contextMenuRef,
  handleContextMenuAction
}) => {
  if (!contextMenu.visible) return null;
  
  return (
    <div 
      ref={contextMenuRef}
      className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-50"
      style={{ 
        left: `${contextMenu.x}px`, 
        top: `${contextMenu.y}px`,
        minWidth: '200px',
        transform: 'translateY(-100%)',
        marginTop: '-20px'
      }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={`tab-${contextMenu.tabId}`}
    >
      <div className="p-3 pb-2 border-b border-gray-100">
        <h3 className="text-base font-medium">Settings</h3>
      </div>
      
      <div>
        <TabContextMenuActions
          action="setFirst"
          label="Set as first page"
          icon="flag.svg"
          iconColor="text-blue-500"
          onClick={() => handleContextMenuAction('setFirst', contextMenu.tabId)}
        />
        
        <TabContextMenuActions
          action="rename"
          label="Rename"
          icon="pencil-line.svg"
          iconColor="text-gray-500"
          onClick={() => handleContextMenuAction('rename', contextMenu.tabId)}
        />
        
        <TabContextMenuActions
          action="copy"
          label="Copy"
          icon="copy.svg"
          iconColor="text-gray-500"
          onClick={() => handleContextMenuAction('copy', contextMenu.tabId)}
        />
        
        <TabContextMenuActions
          action="duplicate"
          label="Duplicate"
          icon="duplicate.svg"
          iconColor="text-gray-500"
          onClick={() => handleContextMenuAction('duplicate', contextMenu.tabId)}
        />
      </div>
      
      <div className="border-t border-gray-200 my-1"></div>
      
      <div>
        <TabContextMenuActions
          action="delete"
          label="Delete"
          icon="trash.svg"
          iconColor="text-red-500"
          onClick={() => handleContextMenuAction('delete', contextMenu.tabId)}
        />
      </div>
    </div>
  );
};

export default ContextMenu;
