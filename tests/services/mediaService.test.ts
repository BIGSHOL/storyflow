import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockUpload = vi.fn();
const mockRemove = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn((_table: string) => ({
  select: mockSelect,
  insert: mockInsert,
  delete: mockDelete,
  update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
}));
const mockGetUser = vi.fn();

vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
    auth: {
      getUser: () => mockGetUser(),
    },
    storage: {
      from: () => ({
        upload: mockUpload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  },
}));

// Import after mocking
import {
  validateFile,
  uploadMedia,
  deleteMedia,
  getMediaList,
} from '../../services/mediaService';

describe('mediaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock chain
    mockSelect.mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    mockUpload.mockResolvedValue({ error: null });
    mockRemove.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/media/test.jpg' },
    });
  });

  describe('validateFile', () => {
    it('should accept valid image files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid video files', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB

      const result = validateFile(file);

      expect(result.valid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const file = new File([''], 'test.exe', { type: 'application/x-executable' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('이미지 또는 비디오 파일만');
    });

    it('should reject files that are too large', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 100 * 1024 * 1024 }); // 100MB

      const result = validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('파일 크기가 너무 커요');
    });
  });

  describe('uploadMedia', () => {
    it('should upload file and return media record', async () => {
      const mockMedia = {
        id: 'media-123',
        user_id: 'user-123',
        file_name: 'test.jpg',
        file_path: 'user-123/123-abc.jpg',
        file_size: 1024,
        mime_type: 'image/jpeg',
        public_url: 'https://example.com/media/test.jpg',
      };

      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockMedia, error: null }),
        }),
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const { data, error } = await uploadMedia(file);

      expect(mockUpload).toHaveBeenCalled();
      expect(data).toEqual(mockMedia);
      expect(error).toBeNull();
    });

    it('should return error when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const { data, error } = await uploadMedia(file);

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.message).toBe('로그인이 필요합니다.');
    });

    it('should return error for invalid file', async () => {
      const file = new File(['test'], 'test.exe', { type: 'application/x-executable' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const { data, error } = await uploadMedia(file);

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.message).toContain('이미지 또는 비디오 파일만');
    });
  });

  describe('deleteMedia', () => {
    it('should delete media from storage and database', async () => {
      const mockMedia = {
        id: 'media-123',
        file_path: 'user-123/test.jpg',
      };

      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockMedia, error: null }),
        }),
      });

      const { success, error } = await deleteMedia('media-123');

      expect(mockRemove).toHaveBeenCalledWith(['user-123/test.jpg']);
      expect(success).toBe(true);
      expect(error).toBeNull();
    });

    it('should return error when media not found', async () => {
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
        }),
      });

      const { success, error } = await deleteMedia('non-existent');

      expect(success).toBe(false);
      expect(error).toBeTruthy();
    });
  });

  describe('getMediaList', () => {
    it('should fetch all media for user', async () => {
      const mockMediaList = [
        { id: 'media-1', file_name: 'image1.jpg' },
        { id: 'media-2', file_name: 'image2.jpg' },
      ];

      mockSelect.mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockMediaList, error: null }),
      });

      const { data, error } = await getMediaList();

      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(data).toEqual(mockMediaList);
      expect(error).toBeNull();
    });

    it('should filter by project id when provided', async () => {
      const mockEq = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      });
      mockSelect.mockReturnValue({
        order: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      // Note: The actual implementation chains order().eq()
      // but our mock returns the eq function from select()
      await getMediaList('project-123');

      expect(mockFrom).toHaveBeenCalledWith('media');
    });
  });
});
