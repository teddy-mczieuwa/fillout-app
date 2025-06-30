import React from 'react';
import { render, screen } from '@testing-library/react';
import TabIcon from '../TabIcon';

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
      className={props.className}
      data-testid="mocked-image"
    />;
  }
}));

describe('TabIcon', () => {


  it('renders check icon when icon prop is check.svg', () => {
    render(<TabIcon icon="check.svg" />);
    
    const image = screen.getByTestId('mocked-image');
    expect(image.getAttribute('src')).toBe('icons/check.svg');
    expect(image.getAttribute('alt')).toBe('Check icon');
  });

  it('renders default file icon when icon prop is undefined', () => {
    render(<TabIcon />);
    
    const image = screen.getByTestId('mocked-image');
    expect(image.getAttribute('src')).toBe('icons/file.svg');
    expect(image.getAttribute('alt')).toBe('File icon');
  });

  it('renders default file icon when icon prop is not info.svg or check.svg', () => {
    render(<TabIcon icon="unknown.svg" />);
    
    const image = screen.getByTestId('mocked-image');
    expect(image.getAttribute('src')).toBe('icons/file.svg');
    expect(image.getAttribute('alt')).toBe('File icon');
  });


  it('has the correct dimensions', () => {
    render(<TabIcon icon="info.svg" />);
    
    const image = screen.getByTestId('mocked-image');
    expect(image.getAttribute('width')).toBe('16');
    expect(image.getAttribute('height')).toBe('16');
  });
});
