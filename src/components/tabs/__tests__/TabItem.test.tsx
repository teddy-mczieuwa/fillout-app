import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabItem from '../TabItem';
import { Tab } from '@/hooks/useDraggableTabs';

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('../TabIcon', () => {
  return function MockTabIcon({ icon }: { icon?: string }) {
    return <span data-testid="mocked-tab-icon">{icon || 'default-icon'}</span>;
  };
});

describe('TabItem', () => {
  const mockTab: Tab = {
    id: '123',
    title: 'Test Tab',
    isActive: false,
    icon: 'test-icon.svg'
  };
  
  const activeTab: Tab = {
    ...mockTab,
    isActive: true
  };

  const mockHandlers = {
    handleDragStart: jest.fn(),
    handleDragOver: jest.fn(),
    handleDragEnd: jest.fn(),
    handleDrop: jest.fn(),
    handleTabClick: jest.fn(),
    handleIconClick: jest.fn()
  };

  const defaultProps = {
    tab: mockTab,
    index: 2,
    draggedTab: null,
    tabsLength: 5,
    ...mockHandlers
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct tab title', () => {
    render(<TabItem {...defaultProps} />);
    
    expect(screen.getByText(mockTab.title)).not.toBe(null);
  });

  it('includes TabIcon component with the correct icon prop', () => {
    render(<TabItem {...defaultProps} />);
    
    const tabIcon = screen.getByTestId('mocked-tab-icon');
    expect(tabIcon).not.toBe(null);
    expect(tabIcon.textContent).toBe(mockTab.icon);
  });

  it('has the correct ARIA attributes', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    expect(button.getAttribute('aria-selected')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(`tabpanel-${mockTab.id}`);
    expect(button.getAttribute('id')).toBe(`tab-${mockTab.id}`);
  });

  it('applies active styling when tab is active', () => {
    render(<TabItem {...defaultProps} tab={activeTab} />);
    
    const button = screen.getByRole('tab');
    expect(button.className).toContain('text-black');
    expect(button.className).toContain('font-medium');
    expect(button.className).toContain('bg-white');
  });

  it('applies inactive styling when tab is not active', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    expect(button.className).toContain('text-gray-500');
  });

  it('calls handleTabClick when clicked', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    fireEvent.click(button);
    
    expect(mockHandlers.handleTabClick).toHaveBeenCalledTimes(1);
    expect(mockHandlers.handleTabClick).toHaveBeenCalledWith(mockTab.id);
  });

  it('calls handleDragStart when drag starts and blurs the element', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    
    const blurSpy = jest.spyOn(HTMLElement.prototype, 'blur');
    
    fireEvent.dragStart(button);
    
    expect(blurSpy).toHaveBeenCalledTimes(1);
    expect(mockHandlers.handleDragStart).toHaveBeenCalledTimes(1);
    expect(mockHandlers.handleDragStart).toHaveBeenCalledWith(expect.anything(), mockTab, defaultProps.index);
    
    blurSpy.mockRestore();
  });

  it('calls handleDragOver when dragging over', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    fireEvent.dragOver(button);
    
    expect(mockHandlers.handleDragOver).toHaveBeenCalledTimes(1);
    expect(mockHandlers.handleDragOver).toHaveBeenCalledWith(expect.anything(), defaultProps.index);
  });

  it('calls handleDragEnd when drag ends', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    fireEvent.dragEnd(button);
    
    expect(mockHandlers.handleDragEnd).toHaveBeenCalledTimes(1);
  });

  it('calls handleDrop when item is dropped', () => {
    render(<TabItem {...defaultProps} />);
    
    const button = screen.getByRole('tab');
    fireEvent.drop(button);
    
    expect(mockHandlers.handleDrop).toHaveBeenCalledTimes(1);
  });

  it('renders options button only for active tabs', () => {
    const { rerender } = render(<TabItem {...defaultProps} />);
    
    expect(screen.queryByLabelText(/options for/i)).toBe(null);
    
    rerender(<TabItem {...defaultProps} tab={activeTab} />);
    
    const optionsButton = screen.getByLabelText(`Options for ${activeTab.title} tab`);
    expect(optionsButton).not.toBe(null);
  });

  it('calls handleIconClick when options button is clicked', () => {
    render(<TabItem {...defaultProps} tab={activeTab} />);
    
    const optionsButton = screen.getByLabelText(`Options for ${activeTab.title} tab`);
    fireEvent.click(optionsButton);
    
    expect(mockHandlers.handleIconClick).toHaveBeenCalledTimes(1);
    expect(mockHandlers.handleIconClick).toHaveBeenCalledWith(expect.anything(), activeTab.id);
  });

  it('handles keyboard navigation with arrow keys', () => {
    const mockElement = document.createElement('button');
    const mockFocus = jest.fn();
    mockElement.focus = mockFocus;
    
    const mockGetElementById = function(id: string): HTMLElement | null {
      if (id === 'tab-124' || id === 'tab-122') {
        return mockElement;
      }
      return null;
    };
    
    jest.spyOn(document, 'getElementById').mockImplementation(mockGetElementById);
    
    try {
      render(<TabItem {...defaultProps} />);
      
      const button = screen.getByRole('tab');
      fireEvent.keyDown(button, { key: 'ArrowRight' });
      expect(mockFocus).toHaveBeenCalled();
      
      jest.clearAllMocks();
      
      fireEvent.keyDown(button, { key: 'ArrowLeft' });
      expect(mockFocus).toHaveBeenCalled();
    } finally {
      jest.restoreAllMocks();
    }
  });
});
