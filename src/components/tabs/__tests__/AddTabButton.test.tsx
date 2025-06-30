import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddTabButton from '../AddTabButton';

import { describe, it, expect, jest } from '@jest/globals';

describe('AddTabButton', () => {
  const defaultProps = {
    tabsLength: 3,
    showAddButton: null,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    handleAddTab: jest.fn()
  };

  it('does not render the button when showAddButton does not match tabsLength', () => {
    const { queryByRole } = render(<AddTabButton {...defaultProps} />);
    
    const button = queryByRole('button', { name: 'Add tab at the end' });
    expect(button).toBeNull();
  });

  it('renders the button when showAddButton matches tabsLength', () => {
    const props = {
      ...defaultProps,
      showAddButton: defaultProps.tabsLength
    };
    
    const { getByRole } = render(<AddTabButton {...props} />);
    
    const button = getByRole('button', { name: 'Add tab at the end' });
    expect(button).toBeDefined();
    expect(button.textContent).toBe('+');
  });

  it('has the correct button styling when visible', () => {
    const props = {
      ...defaultProps,
      showAddButton: defaultProps.tabsLength
    };
    
    const { getByRole } = render(<AddTabButton {...props} />);
    
    const button = getByRole('button', { name: 'Add tab at the end' });
    expect(button.className).toContain('rounded-full');
    expect(button.className).toContain('bg-gray-100');
    expect(button.className).toContain('border-gray-300');
  });

  it('calls handleMouseEnter when mouse enters the container', () => {
    const mockHandleMouseEnter = jest.fn();
    const props = {
      ...defaultProps,
      handleMouseEnter: mockHandleMouseEnter
    };
    
    const { container } = render(<AddTabButton {...props} />);
    
    const containerDiv = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(containerDiv);
    
    expect(mockHandleMouseEnter).toHaveBeenCalledTimes(1);
    expect(mockHandleMouseEnter).toHaveBeenCalledWith(defaultProps.tabsLength);
  });

  it('calls handleMouseLeave when mouse leaves the container', () => {
    const mockHandleMouseLeave = jest.fn();
    const props = {
      ...defaultProps,
      handleMouseLeave: mockHandleMouseLeave
    };
    
    const { container } = render(<AddTabButton {...props} />);
    
    const containerDiv = container.firstChild as HTMLElement;
    fireEvent.mouseLeave(containerDiv);
    
    expect(mockHandleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('calls handleAddTab when the button is clicked', () => {
    const mockHandleAddTab = jest.fn();
    const props = {
      ...defaultProps,
      showAddButton: defaultProps.tabsLength,
      handleAddTab: mockHandleAddTab
    };
    
    const { getByRole } = render(<AddTabButton {...props} />);
    
    const button = getByRole('button', { name: 'Add tab at the end' });
    fireEvent.click(button);
    
    expect(mockHandleAddTab).toHaveBeenCalledTimes(1);
    expect(mockHandleAddTab).toHaveBeenCalledWith(defaultProps.tabsLength);
  });

  it('has the correct accessibility attributes when button is visible', () => {
    const props = {
      ...defaultProps,
      showAddButton: defaultProps.tabsLength
    };
    
    const { getByRole } = render(<AddTabButton {...props} />);
    
    const button = getByRole('button', { name: 'Add tab at the end' });
    expect(button.getAttribute('aria-label')).toBe('Add tab at the end');
    expect(button.getAttribute('type')).toBe('button');
  });
});
