import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn((_table: string) => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
}));
const mockGetUser = vi.fn();

vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
    auth: {
      getUser: () => mockGetUser(),
    },
  },
}));

// Import after mocking
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../../services/projectService';

describe('projectService', () => {
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

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
  });

  describe('getProjects', () => {
    it('should fetch all projects for the user', async () => {
      const mockProjects = [
        { id: '1', title: 'Project 1' },
        { id: '2', title: 'Project 2' },
      ];

      mockSelect.mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
      });

      const { data, error } = await getProjects();

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(data).toEqual(mockProjects);
      expect(error).toBeNull();
    });

    it('should return error when fetch fails', async () => {
      const mockError = new Error('Database error');
      mockSelect.mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      });

      const { data, error } = await getProjects();

      expect(data).toBeNull();
      expect(error).toBeTruthy();
    });
  });

  describe('getProject', () => {
    it('should fetch a single project by id', async () => {
      const mockProject = { id: '1', title: 'Test Project' };

      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
        }),
      });

      const { data, error } = await getProject('1');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(data).toEqual(mockProject);
      expect(error).toBeNull();
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const mockProject = {
        id: '1',
        title: 'New Project',
        user_id: 'user-123',
        sections: [],
      };

      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
        }),
      });

      const { data, error } = await createProject('New Project', []);

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(data).toEqual(mockProject);
      expect(error).toBeNull();
    });

    it('should return error when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { data, error } = await createProject('Test', []);

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.message).toBe('로그인이 필요합니다.');
    });
  });

  describe('updateProject', () => {
    it('should update project title', async () => {
      const mockProject = { id: '1', title: 'Updated Title' };

      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
          }),
        }),
      });

      const { data, error } = await updateProject('1', { title: 'Updated Title' });

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(data).toEqual(mockProject);
      expect(error).toBeNull();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      mockDelete.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const { success, error } = await deleteProject('1');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(success).toBe(true);
      expect(error).toBeNull();
    });

    it('should return error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      mockDelete.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      });

      const { success, error } = await deleteProject('1');

      expect(success).toBe(false);
      expect(error).toBeTruthy();
    });
  });
});
