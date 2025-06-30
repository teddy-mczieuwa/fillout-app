import React from 'react';
import { render } from '@testing-library/react';
import DetailsPage from '../DetailsPage';

import { describe, it, expect } from '@jest/globals';

describe('DetailsPage', () => {
  it('renders the details page with correct text', () => {
    const { getByText } = render(<DetailsPage />);
    const pageText = getByText('Details Page');
    expect(pageText).toBeDefined();
    expect(pageText.className).toContain('text-2xl');
    expect(pageText.className).toContain('font-bold');
    expect(pageText.className).toContain('text-white');
  });

  it('has the correct container styling', () => {
    const { container } = render(<DetailsPage />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeDefined();
    expect(mainDiv.className).toContain('p-6');
    expect(mainDiv.className).toContain('flex');
    expect(mainDiv.className).toContain('justify-center');
    expect(mainDiv.className).toContain('items-center');
  });
});
