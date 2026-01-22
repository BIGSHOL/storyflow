# Collaboration Specialist Agent

협업 및 공유 기능 전문 에이전트입니다.

## 역할

StoryFlow Creator의 실시간 협업, 공유, 권한 관리 기능을 설계하고 구현합니다.

## 협업 기능

### Phase 1: 공유 (완료)
- 공유 링크 생성
- 읽기 전용 뷰어
- 링크 비활성화

### Phase 2: 협업자 초대 (진행중)
- 이메일로 협업자 초대
- 읽기/편집 권한 부여
- 협업자 목록 관리

### Phase 3: 실시간 협업 (계획)
- 동시 편집
- 커서 위치 공유
- 실시간 변경사항 동기화
- 충돌 해결

## 담당 파일

```
storyflow-creator/
├── services/
│   ├── shareService.ts           # 공유 링크 관리
│   └── collaborationService.ts   # 협업자 관리
├── pages/
│   └── ViewerPage.tsx            # 공유 뷰어
├── components/
│   ├── ShareDialog.tsx           # 공유 다이얼로그
│   ├── CollaborationDialog.tsx   # 협업자 관리 다이얼로그
│   ├── CollaboratorList.tsx      # 협업자 목록
│   ├── InviteForm.tsx            # 초대 폼
│   └── RealtimeCursors.tsx       # 실시간 커서 (Phase 3)
├── hooks/
│   ├── useShare.ts               # 공유 훅
│   ├── useCollaborators.ts       # 협업자 훅
│   └── useRealtimeSync.ts        # 실시간 동기화 훅
└── types/
    └── collaboration.ts          # 협업 타입
```

## 데이터 모델

### 타입 정의
```typescript
// types/collaboration.ts

type Permission = 'view' | 'edit';

interface ShareLink {
  id: string;
  projectId: string;
  token: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

interface Collaborator {
  id: string;
  projectId: string;
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  permission: Permission;
  invitedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined';
}

interface CollaborationInvite {
  id: string;
  projectId: string;
  projectTitle: string;
  inviterName: string;
  inviterEmail: string;
  permission: Permission;
  createdAt: Date;
}

// 실시간 협업 (Phase 3)
interface RealtimeCursor {
  oderId: string;
  userName: string;
  color: string;
  position: {
    sectionId: string;
    field: 'title' | 'description';
    offset: number;
  };
}

interface RealtimePresence {
  userId: string;
  userName: string;
  avatarUrl?: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
}
```

### DB 스키마
```sql
-- 공유 링크
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_share_links_token ON share_links(token);

-- 협업자
CREATE TABLE collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(project_id, user_id)
);

-- RLS 정책
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- 프로젝트 소유자는 협업자 관리 가능
CREATE POLICY "Owners can manage collaborators" ON collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- 협업자는 자신의 항목 조회 가능
CREATE POLICY "Users can view own collaborator entries" ON collaborators
  FOR SELECT USING (auth.uid() = user_id);

-- 협업자는 초대 수락/거절 가능
CREATE POLICY "Users can update own status" ON collaborators
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## 서비스 구현

### shareService.ts
```typescript
// services/shareService.ts
import { supabase } from './supabaseClient';
import { nanoid } from 'nanoid';

export const shareService = {
  // 공유 링크 생성
  async createShareLink(projectId: string, expiresInDays?: number) {
    const token = nanoid(12);
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const { data, error } = await supabase
      .from('share_links')
      .insert({
        project_id: projectId,
        token,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (data) {
      // 프로젝트에 share_token 저장
      await supabase
        .from('projects')
        .update({ share_token: token, is_public: true })
        .eq('id', projectId);
    }

    const shareUrl = `${window.location.origin}/view/${token}`;
    return { data: { ...data, shareUrl }, error };
  },

  // 공유 링크 비활성화
  async deactivateShareLink(projectId: string) {
    await supabase
      .from('share_links')
      .update({ is_active: false })
      .eq('project_id', projectId);

    await supabase
      .from('projects')
      .update({ share_token: null, is_public: false })
      .eq('id', projectId);

    return { error: null };
  },

  // 공유 토큰으로 프로젝트 조회
  async getProjectByToken(token: string) {
    // 링크 유효성 확인
    const { data: link } = await supabase
      .from('share_links')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (!link) {
      return { data: null, error: { message: '유효하지 않은 링크예요' } };
    }

    // 만료 확인
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return { data: null, error: { message: '만료된 링크예요' } };
    }

    // 프로젝트 조회
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('share_token', token)
      .single();

    return { data, error };
  },
};
```

### collaborationService.ts
```typescript
// services/collaborationService.ts
import { supabase } from './supabaseClient';
import { Collaborator, Permission } from '../types/collaboration';

export const collaborationService = {
  // 협업자 초대
  async inviteCollaborator(projectId: string, email: string, permission: Permission) {
    // 사용자 찾기
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('email', email)
      .single();

    if (!user) {
      return { data: null, error: { message: '등록된 사용자가 아니에요' } };
    }

    // 이미 협업자인지 확인
    const { data: existing } = await supabase
      .from('collaborators')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return { data: null, error: { message: '이미 초대된 사용자예요' } };
    }

    // 협업자 추가
    const { data, error } = await supabase
      .from('collaborators')
      .insert({
        project_id: projectId,
        user_id: user.id,
        permission,
      })
      .select()
      .single();

    // TODO: 이메일 알림 발송

    return { data, error };
  },

  // 협업자 목록 조회
  async getCollaborators(projectId: string) {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        user:profiles(display_name, email, avatar_url)
      `)
      .eq('project_id', projectId)
      .order('invited_at', { ascending: false });

    return { data, error };
  },

  // 협업자 권한 변경
  async updatePermission(collaboratorId: string, permission: Permission) {
    const { data, error } = await supabase
      .from('collaborators')
      .update({ permission })
      .eq('id', collaboratorId)
      .select()
      .single();

    return { data, error };
  },

  // 협업자 제거
  async removeCollaborator(collaboratorId: string) {
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', collaboratorId);

    return { error };
  },

  // 초대 수락
  async acceptInvitation(collaboratorId: string) {
    const { data, error } = await supabase
      .from('collaborators')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', collaboratorId)
      .select()
      .single();

    return { data, error };
  },

  // 초대 거절
  async declineInvitation(collaboratorId: string) {
    const { data, error } = await supabase
      .from('collaborators')
      .update({ status: 'declined' })
      .eq('id', collaboratorId)
      .select()
      .single();

    return { data, error };
  },

  // 내 초대 목록
  async getMyInvitations() {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        project:projects(title, user:profiles(display_name, email))
      `)
      .eq('status', 'pending');

    return { data, error };
  },

  // 프로젝트 접근 권한 확인
  async checkAccess(projectId: string, userId: string): Promise<Permission | null> {
    // 소유자 확인
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (project?.user_id === userId) {
      return 'edit';
    }

    // 협업자 확인
    const { data: collaborator } = await supabase
      .from('collaborators')
      .select('permission')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .single();

    return collaborator?.permission || null;
  },
};
```

## 실시간 협업 (Phase 3)

### useRealtimeSync.ts
```typescript
// hooks/useRealtimeSync.ts
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Section } from '../types';

interface UseRealtimeSyncOptions {
  projectId: string;
  userId: string;
  userName: string;
  onSectionsUpdate: (sections: Section[]) => void;
  onPresenceUpdate: (presence: RealtimePresence[]) => void;
}

export const useRealtimeSync = ({
  projectId,
  userId,
  userName,
  onSectionsUpdate,
  onPresenceUpdate,
}: UseRealtimeSyncOptions) => {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // 채널 구독
    const channel = supabase.channel(`project:${projectId}`, {
      config: {
        presence: { key: userId },
      },
    });

    // 프로젝트 변경 감지
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`,
      },
      (payload) => {
        onSectionsUpdate(payload.new.sections);
      }
    );

    // 프레젠스 (온라인 상태)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const presence = Object.values(state).flat() as RealtimePresence[];
      onPresenceUpdate(presence);
    });

    // 브로드캐스트 (커서 위치)
    channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
      // 커서 위치 업데이트
    });

    // 구독 시작
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          oderId: userId,
          userName,
          isOnline: true,
          lastSeen: new Date().toISOString(),
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [projectId, userId, userName]);

  // 섹션 변경 브로드캐스트
  const broadcastSectionUpdate = useCallback((sections: Section[]) => {
    if (!channelRef.current) return;

    // DB 업데이트 (다른 사용자에게 전파됨)
    supabase
      .from('projects')
      .update({ sections })
      .eq('id', projectId);
  }, [projectId]);

  // 커서 위치 브로드캐스트
  const broadcastCursor = useCallback((position: CursorPosition) => {
    if (!channelRef.current) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        userId,
        userName,
        position,
      },
    });
  }, [userId, userName]);

  return { broadcastSectionUpdate, broadcastCursor };
};
```

### 충돌 해결 전략

```typescript
// Operational Transformation (OT) 기반 충돌 해결
interface Operation {
  type: 'insert' | 'delete' | 'update';
  path: string[]; // e.g., ['sections', '0', 'title']
  value: any;
  timestamp: number;
  userId: string;
}

const resolveConflict = (local: Operation, remote: Operation): Operation[] => {
  // 같은 경로에 대한 동시 수정
  if (arraysEqual(local.path, remote.path)) {
    // 나중에 발생한 작업 우선 (Last Writer Wins)
    if (local.timestamp > remote.timestamp) {
      return [local];
    }
    return [remote];
  }

  // 다른 경로는 둘 다 적용
  return [local, remote];
};
```

## 컴포넌트 구현

### ShareDialog
```tsx
// components/ShareDialog.tsx
interface ShareDialogProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateLink = async () => {
    setIsLoading(true);
    const { data, error } = await shareService.createShareLink(projectId);
    if (data) {
      setShareUrl(data.shareUrl);
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었어요!');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">공유하기</h2>

      {shareUrl ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-700 rounded"
            />
            <button onClick={handleCopy} className="px-4 py-2 bg-blue-500 rounded">
              복사
            </button>
          </div>
          <p className="text-sm text-gray-400">
            이 링크를 가진 누구나 프로젝트를 볼 수 있어요
          </p>
        </div>
      ) : (
        <button
          onClick={handleCreateLink}
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 rounded-lg"
        >
          {isLoading ? '생성 중...' : '공유 링크 생성'}
        </button>
      )}
    </Dialog>
  );
};
```

## 작업 지침

### 새 협업 기능 추가 시
1. 타입 정의
2. DB 스키마 (필요시)
3. 서비스 함수 구현
4. 컴포넌트 구현
5. 권한 검사 추가

### 실시간 기능 구현 시
1. Supabase Realtime 채널 설정
2. 프레젠스 관리
3. 브로드캐스트 이벤트 처리
4. 충돌 해결 로직

## 체크리스트

- [ ] 공유 링크가 안전한가?
- [ ] 권한 검사가 올바른가?
- [ ] 초대 이메일이 발송되는가?
- [ ] 실시간 동기화가 안정적인가?
- [ ] 충돌 해결이 올바른가?
