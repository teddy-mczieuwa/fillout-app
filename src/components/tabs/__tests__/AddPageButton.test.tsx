import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddPageButton from '../AddPageButton';

import { describe, it, expect, jest } from '@jest/globals';

describe('AddPageButton', () => {
  it('renders the button with correct text', () => {
    const mockHandleAddTab = jest.fn();
    const { getByText } = render(
      <AddPageButton handleAddTab={mockHandleAddTab} tabsLength={3} />
    );
    
    const buttonText = getByText('Add page');
    expect(buttonText).toBeDefined();
  });

  it('has the correct styling', () => {
    const mockHandleAddTab = jest.fn();
    const { getByRole } = render(
      <AddPageButton handleAddTab={mockHandleAddTab} tabsLength={3} />
    );
    
    const button = getByRole('button', { name: 'Add new page' });
    expect(button.className).toContain('px-3');
    expect(button.className).toContain('py-1');
    expect(button.className).toContain('border');
    expect(button.className).toContain('rounded');
  });

  it('calls handleAddTab with correct index when clicked', () => {
    const mockHandleAddTab = jest.fn();
    const tabsLength = 5;
    
    const { getByRole } = render(
      <AddPageButton handleAddTab={mockHandleAddTab} tabsLength={tabsLength} />
    );
    
    const button = getByRole('button', { name: 'Add new page' });
    fireEvent.click(button);
    
    expect(mockHandleAddTab).toHaveBeenCalledTimes(1);
    expect(mockHandleAddTab).toHaveBeenCalledWith(tabsLength);
  });

  it('has the correct accessibility attributes', () => {
    const mockHandleAddTab = jest.fn();
    const { getByRole } = render(
      <AddPageButton handleAddTab={mockHandleAddTab} tabsLength={3} />
    );
    
    const button = getByRole('button', { name: 'Add new page' });
    expect(button.getAttribute('aria-label')).toBe('Add new page');
    expect(button.getAttribute('type')).toBe('button');
  });
});
