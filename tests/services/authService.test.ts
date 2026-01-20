import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
      signOut: () => mockSignOut(),
      getUser: () => mockGetUser(),
      getSession: () => mockGetSession(),
      onAuthStateChange: (callback: unknown) => mockOnAuthStateChange(callback),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

// Import after mocking
import {
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getCurrentSession,
  onAuthStateChange,
} from '../../services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInWithGoogle', () => {
    it('should call supabase signInWithOAuth with google provider', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });

      const result = await signInWithGoogle();

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.any(String),
        }),
      });
      expect(result.error).toBeNull();
    });

    it('should return error when OAuth fails', async () => {
      const mockError = { message: 'OAuth failed' };
      mockSignInWithOAuth.mockResolvedValue({ error: mockError });

      const result = await signInWithGoogle();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const result = await signOut();

      expect(mockSignOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should return error when sign out fails', async () => {
      const mockError = { message: 'Sign out failed' };
      mockSignOut.mockResolvedValue({ error: mockError });

      const result = await signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const user = await getCurrentUser();

      expect(mockGetUser).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getCurrentSession', () => {
    it('should return session when exists', async () => {
      const mockSession = { access_token: 'token-123' };
      mockGetSession.mockResolvedValue({ data: { session: mockSession } });

      const session = await getCurrentSession();

      expect(mockGetSession).toHaveBeenCalled();
      expect(session).toEqual(mockSession);
    });

    it('should return null when no session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      const session = await getCurrentSession();

      expect(session).toBeNull();
    });
  });

  describe('onAuthStateChange', () => {
    it('should register auth state change listener', () => {
      const callback = vi.fn();
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      onAuthStateChange(callback);

      expect(mockOnAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
