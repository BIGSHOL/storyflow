import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn((_table: string) => ({
  update: mockUpdate,
  select: mockSelect,
}));

vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

// Import after mocking
import {
  enableShareLink,
  disableShareLink,
  getSharedProject,
  getShareUrl,
  copyToClipboard,
} from '../../services/shareService';

describe('shareService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });
  });

  describe('enableShareLink', () => {
    it('should enable share link and return share ID', async () => {
      const { shareId, error } = await enableShareLink('project-123');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(shareId).toBeTruthy();
      expect(shareId?.length).toBe(16); // 8 + 8 characters
      expect(error).toBeNull();
    });

    it('should return error when update fails', async () => {
      const mockError = new Error('Update failed');
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      });

      const { shareId, error } = await enableShareLink('project-123');

      expect(shareId).toBeNull();
      expect(error).toBeTruthy();
    });
  });

  describe('disableShareLink', () => {
    it('should disable share link successfully', async () => {
      const { success, error } = await disableShareLink('project-123');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(success).toBe(true);
      expect(error).toBeNull();
    });

    it('should return error when update fails', async () => {
      const mockError = new Error('Update failed');
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      });

      const { success, error } = await disableShareLink('project-123');

      expect(success).toBe(false);
      expect(error).toBeTruthy();
    });
  });

  describe('getSharedProject', () => {
    it('should return project when share ID is valid', async () => {
      const mockProject = {
        id: 'project-123',
        title: 'Test Project',
        share_id: 'abc123def456',
        is_public: true,
      };

      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
          }),
        }),
      });

      const { data, error } = await getSharedProject('abc123def456');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(data).toEqual(mockProject);
      expect(error).toBeNull();
    });

    it('should return error when project not found', async () => {
      const mockError = new Error('Not found');
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      const { data, error } = await getSharedProject('invalid-id');

      expect(data).toBeNull();
      expect(error).toBeTruthy();
    });
  });

  describe('getShareUrl', () => {
    it('should generate correct share URL', () => {
      // Mock window.location.origin
      const originalOrigin = window.location.origin;
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true,
      });

      const url = getShareUrl('abc123def456');

      expect(url).toBe('https://example.com/view/abc123def456');

      // Restore
      Object.defineProperty(window, 'location', {
        value: { origin: originalOrigin },
        writable: true,
      });
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
      });

      const success = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(success).toBe(true);
    });

    it('should use fallback when clipboard API fails', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockRejectedValue(new Error('Failed')) },
        writable: true,
      });

      // Mock fallback - execCommand returning true means fallback succeeded
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const success = await copyToClipboard('test text');

      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(success).toBe(true);
    });
  });
});
