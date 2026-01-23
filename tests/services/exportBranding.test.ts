import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateHTML } from '../../services/exportService';
import type { Section } from '../../types';

// fetch mock (이미지 변환용)
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  blob: () => Promise.resolve(new Blob(['test'], { type: 'image/png' })),
});

// FileReader mock
class MockFileReader {
  result: string = 'data:image/png;base64,test';
  onloadend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readAsDataURL() {
    setTimeout(() => this.onloadend?.(), 0);
  }
}
(global as any).FileReader = MockFileReader;

const mockSection: Section = {
  id: 'test-1',
  layout: 'hero' as any,
  title: 'Test Title',
  description: 'Test Description',
  mediaType: 'none',
  textAlignment: 'center',
};

describe('exportService - 브랜딩 워터마크', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('기본(Free 플랜)으로 "Made with StoryFlow" 워터마크를 포함한다', async () => {
    const html = await generateHTML([mockSection], 'Test');

    expect(html).toContain('Made with StoryFlow');
    expect(html).toContain('<footer');
  });

  it('removeBranding=false일 때 워터마크를 포함한다', async () => {
    const html = await generateHTML([mockSection], 'Test', undefined, {
      removeBranding: false,
    });

    expect(html).toContain('Made with StoryFlow');
  });

  it('removeBranding=true일 때 워터마크를 제거한다 (Pro/Team)', async () => {
    const html = await generateHTML([mockSection], 'Test', undefined, {
      removeBranding: true,
    });

    expect(html).not.toContain('Made with StoryFlow');
    expect(html).not.toContain('<footer');
  });

  it('options 없이 호출해도 워터마크가 포함된다', async () => {
    const html = await generateHTML([mockSection], 'Test');

    expect(html).toContain('Made with StoryFlow');
  });
});
