import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn((_table: string) => ({
  insert: mockInsert,
  select: mockSelect,
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
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  checkPermission,
} from '../../services/collaborationService';

describe('collaborationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  describe('inviteCollaborator', () => {
    it('should invite a collaborator successfully', async () => {
      const targetUserId = 'target-user-456';
      const mockCollaborator = {
        id: 'collab-123',
        project_id: 'project-123',
        user_id: targetUserId,
        permission: 'view',
        invited_by: 'user-123',
      };

      // profiles 테이블에서 이메일로 user_id 조회, collaborators 테이블에서 기존 협업자 확인
      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: targetUserId }, error: null }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        // collaborators
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockCollaborator, error: null }),
            }),
          }),
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { data, error } = await inviteCollaborator(
        'project-123',
        'test@example.com',
        'view'
      );

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockFrom).toHaveBeenCalledWith('collaborators');
      expect(data).toEqual(mockCollaborator);
      expect(error).toBeNull();
    });

    it('should return error when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { data, error } = await inviteCollaborator(
        'project-123',
        'test@example.com',
        'view'
      );

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error?.message).toBe('로그인이 필요합니다.');
    });

    it('should return error when user not found', async () => {
      // profiles에서 사용자를 찾을 수 없는 경우
      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        return {
          insert: mockInsert,
          select: mockSelect,
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { data, error } = await inviteCollaborator(
        'project-123',
        'test@example.com',
        'view'
      );

      expect(data).toBeNull();
      expect(error?.message).toBe('해당 이메일의 사용자를 찾을 수 없어요. 먼저 StoryFlow에 가입해야 해요.');
    });

    it('should return error when user already invited', async () => {
      const targetUserId = 'target-user-456';

      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: targetUserId }, error: null }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        // collaborators - 이미 존재하는 경우
        return {
          insert: mockInsert,
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'existing' },
                  error: null,
                }),
              }),
            }),
          }),
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { data, error } = await inviteCollaborator(
        'project-123',
        'test@example.com',
        'view'
      );

      expect(data).toBeNull();
      expect(error?.message).toBe('이미 초대된 사용자입니다.');
    });

    it('should return error when trying to invite self', async () => {
      // 본인을 초대하려는 경우
      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: 'user-123' }, error: null }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        return {
          insert: mockInsert,
          select: mockSelect,
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { data, error } = await inviteCollaborator(
        'project-123',
        'self@example.com',
        'view'
      );

      expect(data).toBeNull();
      expect(error?.message).toBe('본인을 협업자로 초대할 수 없어요.');
    });
  });

  describe('getCollaborators', () => {
    it('should fetch collaborators list', async () => {
      const mockCollaborators = [
        { id: 'collab-1', user_id: 'user-1', permission: 'view' },
        { id: 'collab-2', user_id: 'user-2', permission: 'edit' },
      ];

      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockCollaborators, error: null }),
        }),
      });

      const { data, error } = await getCollaborators('project-123');

      expect(mockFrom).toHaveBeenCalledWith('collaborators');
      expect(data).toEqual(mockCollaborators);
      expect(error).toBeNull();
    });
  });

  describe('updateCollaboratorPermission', () => {
    it('should update permission successfully', async () => {
      const { success, error } = await updateCollaboratorPermission(
        'collab-123',
        'edit'
      );

      expect(mockFrom).toHaveBeenCalledWith('collaborators');
      expect(success).toBe(true);
      expect(error).toBeNull();
    });

    it('should return error when update fails', async () => {
      const mockError = new Error('Update failed');
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      });

      const { success, error } = await updateCollaboratorPermission(
        'collab-123',
        'edit'
      );

      expect(success).toBe(false);
      expect(error).toBeTruthy();
    });
  });

  describe('removeCollaborator', () => {
    it('should remove collaborator successfully', async () => {
      const { success, error } = await removeCollaborator('collab-123');

      expect(mockFrom).toHaveBeenCalledWith('collaborators');
      expect(success).toBe(true);
      expect(error).toBeNull();
    });

    it('should return error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      mockDelete.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      });

      const { success, error } = await removeCollaborator('collab-123');

      expect(success).toBe(false);
      expect(error).toBeTruthy();
    });
  });

  describe('checkPermission', () => {
    it('should return owner when user owns the project', async () => {
      // Promise.all()로 병렬 실행되므로 테이블별로 다른 응답 설정
      mockFrom.mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { user_id: 'user-123' },
                  error: null,
                }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        // collaborators
        return {
          insert: mockInsert,
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          }),
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { permission, error } = await checkPermission('project-123');

      expect(permission).toBe('owner');
      expect(error).toBeNull();
    });

    it('should return null when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { permission, error } = await checkPermission('project-123');

      expect(permission).toBeNull();
      expect(error).toBeNull();
    });

    it('should return collaborator permission', async () => {
      // 소유자가 아니고 협업자인 경우
      mockFrom.mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { user_id: 'other-user' },
                  error: null,
                }),
              }),
            }),
            update: mockUpdate,
            delete: mockDelete,
          };
        }
        // collaborators
        return {
          insert: mockInsert,
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { permission: 'edit' },
                  error: null,
                }),
              }),
            }),
          }),
          update: mockUpdate,
          delete: mockDelete,
        };
      });

      const { permission, error } = await checkPermission('project-123');

      expect(permission).toBe('edit');
      expect(error).toBeNull();
    });
  });
});
