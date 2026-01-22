import { Section } from '../types';

// 사용자별 스토리지 키 생성
const getStorageKey = (userId: string | null) =>
  `storyflow_project_${userId || 'anonymous'}`;
const getAutoSaveKey = (userId: string | null) =>
  `storyflow_autosave_${userId || 'anonymous'}`;

// 스토리지 선택: 로그인 사용자는 localStorage, 비로그인 사용자는 sessionStorage
const getStorage = (userId: string | null): Storage => {
  return userId ? localStorage : sessionStorage;
};

// Blob URL을 Base64로 변환
const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    console.error('Blob to Base64 변환 실패');
    return '';
  }
};

// Base64를 Blob URL로 변환
const base64ToBlobUrl = (base64: string): string => {
  try {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.match(/data:([^;]+);/)?.[1] || 'image/png';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch {
    console.error('Base64 to Blob 변환 실패');
    return '';
  }
};

// 저장용 섹션 타입 (mediaUrl이 Base64)
interface StoredSection extends Omit<Section, 'mediaUrl'> {
  mediaBase64?: string;
}

interface StoredProject {
  version: number;
  savedAt: string;
  sections: StoredSection[];
}

// 프로젝트 저장
export const saveProject = async (sections: Section[], userId: string | null = null): Promise<boolean> => {
  try {
    const storedSections: StoredSection[] = await Promise.all(
      sections.map(async (section) => {
        const { mediaUrl, ...rest } = section;
        let mediaBase64 = '';

        if (mediaUrl && mediaUrl.startsWith('blob:')) {
          mediaBase64 = await blobUrlToBase64(mediaUrl);
        } else if (mediaUrl) {
          mediaBase64 = mediaUrl; // 이미 Base64인 경우
        }

        return { ...rest, mediaBase64 };
      })
    );

    const project: StoredProject = {
      version: 1,
      savedAt: new Date().toISOString(),
      sections: storedSections,
    };

    const storage = getStorage(userId);
    storage.setItem(getStorageKey(userId), JSON.stringify(project));
    return true;
  } catch (error) {
    console.error('프로젝트 저장 실패:', error);
    return false;
  }
};

// 프로젝트 불러오기
export const loadProject = (userId: string | null = null): Section[] | null => {
  try {
    const storage = getStorage(userId);
    const data = storage.getItem(getStorageKey(userId));
    if (!data) return null;

    const project: StoredProject = JSON.parse(data);

    const sections: Section[] = project.sections.map((stored) => {
      const { mediaBase64, ...rest } = stored;
      let mediaUrl = '';

      if (mediaBase64) {
        mediaUrl = base64ToBlobUrl(mediaBase64);
      }

      return { ...rest, mediaUrl } as Section;
    });

    return sections;
  } catch (error) {
    console.error('프로젝트 불러오기 실패:', error);
    return null;
  }
};

// 자동 저장 (throttled)
let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

export const autoSave = (sections: Section[], userId: string | null = null): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(async () => {
    try {
      const storedSections: StoredSection[] = await Promise.all(
        sections.map(async (section) => {
          const { mediaUrl, ...rest } = section;
          let mediaBase64 = '';

          if (mediaUrl && mediaUrl.startsWith('blob:')) {
            mediaBase64 = await blobUrlToBase64(mediaUrl);
          } else if (mediaUrl) {
            mediaBase64 = mediaUrl;
          }

          return { ...rest, mediaBase64 };
        })
      );

      const project: StoredProject = {
        version: 1,
        savedAt: new Date().toISOString(),
        sections: storedSections,
      };

      const storage = getStorage(userId);
      storage.setItem(getAutoSaveKey(userId), JSON.stringify(project));
    } catch (error) {
      console.error('자동 저장 실패:', error);
    }
  }, 3000); // 3초 후 자동 저장
};

// 자동 저장 데이터 불러오기
export const loadAutoSave = (userId: string | null = null): Section[] | null => {
  try {
    const storage = getStorage(userId);
    const data = storage.getItem(getAutoSaveKey(userId));
    if (!data) return null;

    const project: StoredProject = JSON.parse(data);

    const sections: Section[] = project.sections.map((stored) => {
      const { mediaBase64, ...rest } = stored;
      let mediaUrl = '';

      if (mediaBase64) {
        mediaUrl = base64ToBlobUrl(mediaBase64);
      }

      return { ...rest, mediaUrl } as Section;
    });

    return sections;
  } catch (error) {
    console.error('자동 저장 불러오기 실패:', error);
    return null;
  }
};

// 저장된 프로젝트가 있는지 확인
export const hasSavedProject = (userId: string | null = null): boolean => {
  const storage = getStorage(userId);
  return storage.getItem(getStorageKey(userId)) !== null ||
         storage.getItem(getAutoSaveKey(userId)) !== null;
};

// 저장 데이터 삭제
export const clearSavedProject = (userId: string | null = null): void => {
  // 진행 중인 자동저장 취소
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
  const storage = getStorage(userId);
  storage.removeItem(getStorageKey(userId));
  storage.removeItem(getAutoSaveKey(userId));
};

// 마지막 저장 시간 가져오기
export const getLastSaveTime = (userId: string | null = null): string | null => {
  try {
    const storage = getStorage(userId);
    const data = storage.getItem(getStorageKey(userId)) || storage.getItem(getAutoSaveKey(userId));
    if (!data) return null;
    const project: StoredProject = JSON.parse(data);
    return project.savedAt;
  } catch {
    return null;
  }
};

// 익명 사용자의 저장된 프로젝트가 있는지 확인 (로그인 후 마이그레이션용)
export const hasAnonymousSavedProject = (): boolean => {
  // 익명 사용자는 sessionStorage를 사용
  return sessionStorage.getItem(getStorageKey(null)) !== null ||
         sessionStorage.getItem(getAutoSaveKey(null)) !== null;
};

// 익명 사용자의 프로젝트 데이터 불러오기
export const loadAnonymousProject = (): Section[] | null => {
  return loadProject(null) || loadAutoSave(null);
};

// 익명 사용자의 저장 데이터 삭제
export const clearAnonymousSavedProject = (): void => {
  clearSavedProject(null);
};
