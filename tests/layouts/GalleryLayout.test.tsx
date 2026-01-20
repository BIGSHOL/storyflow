import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GalleryLayout from '../../components/layouts/GalleryLayout';
import { Section, LayoutType } from '../../types';

const createMockSection = (overrides: Partial<Section> = {}): Section => ({
  id: 'test-section-1',
  layout: LayoutType.GALLERY,
  title: 'Test Gallery',
  description: 'Test description',
  mediaType: 'none',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  ...overrides,
});

describe('GalleryLayout', () => {
  it('renders empty state when no images', () => {
    const section = createMockSection({ galleryImages: [] });
    render(<GalleryLayout section={section} />);

    expect(screen.getByText('갤러리에 이미지를 추가하세요')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    const section = createMockSection({
      title: 'My Gallery',
      description: 'A beautiful collection',
      galleryImages: [{ id: '1', url: 'test.jpg' }],
    });
    render(<GalleryLayout section={section} />);

    expect(screen.getByText('My Gallery')).toBeInTheDocument();
    expect(screen.getByText('A beautiful collection')).toBeInTheDocument();
  });

  it('renders images in grid', () => {
    const section = createMockSection({
      galleryImages: [
        { id: '1', url: 'image1.jpg', caption: 'Image 1' },
        { id: '2', url: 'image2.jpg', caption: 'Image 2' },
        { id: '3', url: 'image3.jpg', caption: 'Image 3' },
      ],
      gallerySettings: { columns: 3, gap: 16, showCaptions: true },
    });
    render(<GalleryLayout section={section} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('hides captions when showCaptions is false', () => {
    const section = createMockSection({
      galleryImages: [
        { id: '1', url: 'image1.jpg', caption: 'Hidden Caption' },
      ],
      gallerySettings: { columns: 3, gap: 16, showCaptions: false },
    });
    render(<GalleryLayout section={section} />);

    expect(screen.queryByText('Hidden Caption')).not.toBeInTheDocument();
  });

  it('applies custom column count', () => {
    const section = createMockSection({
      galleryImages: [{ id: '1', url: 'test.jpg' }],
      gallerySettings: { columns: 4, gap: 20, showCaptions: true },
    });
    const { container } = render(<GalleryLayout section={section} />);

    const grid = container.querySelector('[style*="grid-template-columns"]');
    expect(grid).toHaveStyle('grid-template-columns: repeat(4, 1fr)');
  });
});
