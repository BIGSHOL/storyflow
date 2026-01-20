import React, { useState, useCallback, useEffect } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import Users from 'lucide-react/dist/esm/icons/users';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Crown from 'lucide-react/dist/esm/icons/crown';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import Loader from 'lucide-react/dist/esm/icons/loader';
import {
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  type Permission,
  type CollaboratorWithEmail,
} from '../services/collaborationService';

interface CollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  isOwner: boolean;
}

const CollaborationDialog: React.FC<CollaborationDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  isOwner,
}) => {
  const [collaborators, setCollaborators] = useState<CollaboratorWithEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<Permission>('view');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 협업자 목록 불러오기
  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await getCollaborators(projectId);
      if (fetchError) throw fetchError;
      setCollaborators(data || []);
    } catch (err) {
      console.error('Failed to fetch collaborators:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, fetchCollaborators]);

  // 초대하기
  const handleInvite = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: inviteError } = await inviteCollaborator(
        projectId,
        email.trim(),
        permission
      );

      if (inviteError) throw inviteError;

      if (data) {
        setCollaborators(prev => [data, ...prev]);
        setEmail('');
        setSuccess('초대를 보냈어요!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '초대에 실패했어요.';
      setError(message);
    } finally {
      setInviting(false);
    }
  }, [email, permission, projectId]);

  // 권한 변경
  const handlePermissionChange = useCallback(async (
    collaboratorId: string,
    newPermission: Permission
  ) => {
    try {
      const { success: updateSuccess, error: updateError } = await updateCollaboratorPermission(
        collaboratorId,
        newPermission
      );

      if (updateError) throw updateError;

      if (updateSuccess) {
        setCollaborators(prev =>
          prev.map(c =>
            c.id === collaboratorId ? { ...c, permission: newPermission } : c
          )
        );
      }
    } catch (err) {
      setError('권한 변경에 실패했어요.');
    }
  }, []);

  // 협업자 제거
  const handleRemove = useCallback(async (collaboratorId: string) => {
    if (!confirm('이 협업자를 제거할까요?')) return;

    try {
      const { success: removeSuccess, error: removeError } = await removeCollaborator(
        collaboratorId
      );

      if (removeError) throw removeError;

      if (removeSuccess) {
        setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      }
    } catch (err) {
      setError('협업자 제거에 실패했어요.');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">협업자 관리</h3>
              <p className="text-sm text-gray-400 truncate max-w-[250px]">{projectTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 초대 폼 (소유자만) */}
        {isOwner && (
          <form onSubmit={handleInvite} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  disabled={inviting}
                />
              </div>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as Permission)}
                className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={inviting}
              >
                <option value="view">보기</option>
                <option value="edit">편집</option>
              </select>
              <button
                type="submit"
                disabled={inviting || !email.trim()}
                className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {inviting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus size={16} />
                )}
                초대
              </button>
            </div>
          </form>
        )}

        {/* 알림 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* 협업자 목록 */}
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            협업자 ({collaborators.length}명)
          </h4>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 협업자가 없어요</p>
              {isOwner && <p className="text-sm mt-1">위에서 이메일로 초대해보세요!</p>}
            </div>
          ) : (
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-300">
                        {collaborator.user_id.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm">{collaborator.user_id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(collaborator.created_at).toLocaleDateString('ko-KR')}에 초대됨
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <>
                        <select
                          value={collaborator.permission}
                          onChange={(e) =>
                            handlePermissionChange(collaborator.id, e.target.value as Permission)
                          }
                          className="px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          <option value="view">보기</option>
                          <option value="edit">편집</option>
                        </select>
                        <button
                          onClick={() => handleRemove(collaborator.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="제거"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                        {collaborator.permission === 'edit' ? (
                          <>
                            <Edit3 size={12} /> 편집
                          </>
                        ) : (
                          <>
                            <Eye size={12} /> 보기
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 권한 설명 */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Eye size={12} />
              <span>보기: 프로젝트 열람만 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit3 size={12} />
              <span>편집: 프로젝트 수정 가능</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDialog;
