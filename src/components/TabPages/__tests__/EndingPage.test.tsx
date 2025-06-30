import React from 'react';
import { render } from '@testing-library/react';
import EndingPage from '../EndingPage';

import { describe, it, expect } from '@jest/globals';

describe('EndingPage', () => {
  it('renders the ending page with correct text', () => {
    const { getByText } = render(<EndingPage />);
    const pageText = getByText('Ending Page');
    expect(pageText).toBeDefined();
    expect(pageText.className).toContain('text-2xl');
    expect(pageText.className).toContain('font-bold');
    expect(pageText.className).toContain('text-white');
  });

  it('has the correct container styling', () => {
    const { container } = render(<EndingPage />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeDefined();
    expect(mainDiv.className).toContain('p-6');
    expect(mainDiv.className).toContain('flex');
    expect(mainDiv.className).toContain('justify-center');
    expect(mainDiv.className).toContain('items-center');
  });
});
