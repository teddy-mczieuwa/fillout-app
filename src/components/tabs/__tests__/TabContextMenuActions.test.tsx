import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabContextMenuActions from '../TabContextMenuActions';

import { describe, it, expect, jest } from '@jest/globals';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img 
      src={props.src} 
      alt={props.alt} 
      width={props.width} 
      height={props.height}
      data-testid="mocked-image"
    />;
  }
}));

describe('TabContextMenuActions', () => {
  const defaultProps = {
    action: 'delete',
    label: 'Delete Tab',
    icon: 'trash.svg',
    onClick: jest.fn()
  };

  it('renders with the correct label', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const button = screen.getByRole('menuitem');
    expect(button.textContent).toBe(defaultProps.label);
  });

  it('calls onClick when clicked', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const button = screen.getByRole('menuitem');
    fireEvent.click(button);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('has the correct data-action attribute', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const button = screen.getByRole('menuitem');
    expect(button.getAttribute('data-action')).toBe(defaultProps.action);
  });

  it('renders the icon with correct src', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const image = screen.getByTestId('mocked-image');
    expect(image.getAttribute('src')).toBe(`icons/${defaultProps.icon}`);
  });

  it('applies the default icon color when not specified', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const iconContainer = screen.getByTestId('mocked-image').parentElement;
    expect(iconContainer?.className).toContain('text-gray-500');
  });

  it('applies custom icon color when specified', () => {
    const customProps = {
      ...defaultProps,
      iconColor: 'text-red-500'
    };
    
    render(<TabContextMenuActions {...customProps} />);
    
    const iconContainer = screen.getByTestId('mocked-image').parentElement;
    expect(iconContainer?.className).toContain('text-red-500');
  });

  it('has the correct styling classes', () => {
    render(<TabContextMenuActions {...defaultProps} />);
    
    const button = screen.getByRole('menuitem');
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('flex');
    expect(button.className).toContain('text-sm');
    expect(button.className).toContain('text-gray-700');
  });
});
