import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditModal from '../EditModal';

import { describe, it, expect, jest } from '@jest/globals';

describe('EditModal', () => {
  const mockInputRef = { current: document.createElement('input') } as React.RefObject<HTMLInputElement>;
  
  const defaultProps = {
    editModal: {
      visible: true,
      tabId: 'tab-123',
      title: 'Original Title'
    },
    modalInputRef: mockInputRef,
    setEditModal: jest.fn(),
    handleTabRename: jest.fn(),
    handleModalKeyDown: jest.fn()
  };

  it('renders nothing when not visible', () => {
    const props = {
      ...defaultProps,
      editModal: {
        ...defaultProps.editModal,
        visible: false
      }
    };
    
    const { container } = render(<EditModal {...props} />);
    expect(container.firstChild).toBe(null);
  });

  it('renders the modal when visible', () => {
    render(<EditModal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toBe(null);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('displays the correct title and input value', () => {
    render(<EditModal {...defaultProps} />);
    
    const heading = screen.getByText('Rename Tab');
    expect(heading).not.toBe(null);
    
    const input = screen.getByLabelText('Tab name');
    expect(input.getAttribute('value')).toBe(defaultProps.editModal.title);
  });

  it('closes the modal when clicking the backdrop', () => {
    render(<EditModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(defaultProps.setEditModal).toHaveBeenCalledWith({
      ...defaultProps.editModal,
      visible: false
    });
  });

  it('updates the title when typing in the input', () => {
    render(<EditModal {...defaultProps} />);
    
    const input = screen.getByLabelText('Tab name');
    fireEvent.change(input, { target: { value: 'New Title' } });
    
    expect(defaultProps.setEditModal).toHaveBeenCalledWith({
      ...defaultProps.editModal,
      title: 'New Title'
    });
  });

  it('calls handleTabRename when submitting the form', () => {
    render(<EditModal {...defaultProps} />);
    
    const form = screen.getByLabelText('Tab name').closest('form');
    if (!form) throw new Error('Form not found');
    
    fireEvent.submit(form);
    
    expect(defaultProps.handleTabRename).toHaveBeenCalledTimes(1);
  });

  it('calls handleModalKeyDown when pressing keys in the input', () => {
    render(<EditModal {...defaultProps} />);
    
    const input = screen.getByLabelText('Tab name');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(defaultProps.handleModalKeyDown).toHaveBeenCalledTimes(1);
  });

  it('closes the modal when clicking the Cancel button', () => {
    render(<EditModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.setEditModal).toHaveBeenCalledWith({
      ...defaultProps.editModal,
      visible: false
    });
  });
});
