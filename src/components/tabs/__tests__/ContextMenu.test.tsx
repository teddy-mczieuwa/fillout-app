import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContextMenu from '../ContextMenu';

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

interface TabContextMenuActionsProps {
  action: string;
  label: string;
  icon: string;
  iconColor?: string;
  onClick: () => void;
}

jest.mock('../TabContextMenuActions', () => {
  return function MockTabContextMenuActions(props: TabContextMenuActionsProps) {
    const { action, label, onClick } = props;
    return (
      <button 
        data-testid={`menu-action-${action}`} 
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
});

describe('ContextMenu', () => {
  const mockRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
  const mockHandleContextMenuAction = jest.fn();
  
  const defaultProps = {
    contextMenu: {
      visible: true,
      tabId: 'tab-123',
      x: 100,
      y: 200
    },
    contextMenuRef: mockRef,
    handleContextMenuAction: mockHandleContextMenuAction
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when contextMenu.visible is false', () => {
    const props = {
      ...defaultProps,
      contextMenu: {
        ...defaultProps.contextMenu,
        visible: false
      }
    };
    
    const { container } = render(<ContextMenu {...props} />);
    expect(container.firstChild).toBe(null);
  });

  it('renders the context menu when visible is true', () => {
    render(<ContextMenu {...defaultProps} />);
    
    const contextMenuElement = screen.getByRole('menu');
    expect(contextMenuElement).not.toBe(null);
    expect(contextMenuElement.getAttribute('aria-orientation')).toBe('vertical');
    expect(contextMenuElement.getAttribute('aria-labelledby')).toBe(`tab-${defaultProps.contextMenu.tabId}`);
  });

  it('positions the menu at the specified coordinates', () => {
    render(<ContextMenu {...defaultProps} />);
    
    const contextMenuElement = screen.getByRole('menu');
    expect(contextMenuElement.hasAttribute('style')).toBe(true);
    const styleAttribute = contextMenuElement.getAttribute('style') || '';
    
    expect(styleAttribute).toContain(`left: ${defaultProps.contextMenu.x}px`);
    expect(styleAttribute).toContain(`top: ${defaultProps.contextMenu.y}px`);
  });

  it('has the correct styling classes', () => {
    render(<ContextMenu {...defaultProps} />);
    
    const contextMenuElement = screen.getByRole('menu');
    expect(contextMenuElement.className).toContain('absolute');
    expect(contextMenuElement.className).toContain('bg-white');
    expect(contextMenuElement.className).toContain('shadow-lg');
    expect(contextMenuElement.className).toContain('rounded-md');
    expect(contextMenuElement.className).toContain('border');
  });

  it('renders the header with "Settings" text', () => {
    render(<ContextMenu {...defaultProps} />);
    
    const headerText = screen.getByText('Settings');
    expect(headerText).not.toBe(null);
    expect(headerText.tagName.toLowerCase()).toBe('h3');
  });

  it('calls handleContextMenuAction when a menu action is clicked', () => {
    render(<ContextMenu {...defaultProps} />);
    
    const setFirstButton = screen.getByTestId('menu-action-setFirst');
    fireEvent.click(setFirstButton);
    
    expect(mockHandleContextMenuAction).toHaveBeenCalledTimes(1);
    expect(mockHandleContextMenuAction).toHaveBeenCalledWith('setFirst', defaultProps.contextMenu.tabId);
  });
});
