import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GuestbookEntry, GuestbookSettings } from '../../types';

// 귀여운 동물 아바타 목록 (이모지)
const ANIMAL_AVATARS = [
  '🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
  '🦉', '🦋', '🐢', '🐙', '🦭', '🦦', '🦥', '🦔',
  '🐿️', '🦜', '🦩', '🦚', '🐳', '🐬', '🦈', '🐠',
];

// 엔트리 ID를 기반으로 일관된 동물 아바타 선택
const getAnimalAvatar = (entryId: string): string => {
  let hash = 0;
  for (let i = 0; i < entryId.length; i++) {
    const char = entryId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return ANIMAL_AVATARS[Math.abs(hash) % ANIMAL_AVATARS.length];
};

// IME 지원 Input 컴포넌트 (한글 입력 버그 방지)
const IMEInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, onChange, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onCompositionStart={() => { isComposingRef.current = true; }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        onChange(e.currentTarget.value);
      }}
      {...props}
    />
  );
};

// IME 지원 Textarea 컴포넌트
const IMETextarea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, onChange, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      onCompositionStart={() => { isComposingRef.current = true; }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        onChange(e.currentTarget.value);
      }}
      {...props}
    />
  );
};

interface GuestbookLayoutProps {
  title?: string;
  description?: string;
  entries: GuestbookEntry[];
  settings: GuestbookSettings;
  backgroundColor?: string;
  textColor?: string;
  onAddEntry?: (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => void;
  isPreview?: boolean; // 프리뷰 모드 여부
}

const GuestbookLayout: React.FC<GuestbookLayoutProps> = ({
  title,
  description,
  entries,
  settings,
  backgroundColor = '#111111',
  textColor = '#ffffff',
  onAddEntry,
  isPreview = false,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayStyle = settings.displayStyle || 'card';
  const useAnimalAvatars = settings.useAnimalAvatars ?? false;
  const chatBubbleColor = settings.chatBubbleColor || '#4f46e5'; // 기본 인디고
  const backgroundImage = settings.backgroundImage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (settings.requireName && !name.trim()) return;

    setIsSubmitting(true);

    const finalName = name.trim() || (settings.allowAnonymous ? '익명' : '');

    if (onAddEntry && !isPreview) {
      onAddEntry({
        name: finalName,
        message: message.trim(),
      });
    }

    // 입력 초기화
    setName('');
    setMessage('');
    setIsSubmitting(false);
  };

  // 정렬된 엔트리
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (settings.sortOrder === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }, [entries, settings.sortOrder]);

  // 최대 개수만큼만 표시
  const displayedEntries = sortedEntries.slice(0, settings.maxEntries);

  // 날짜 포맷
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 아바타 렌더링
  const renderAvatar = (entry: GuestbookEntry, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10';
    const emojiSizeClass = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl';

    // 동물 아바타 모드
    if (useAnimalAvatars && displayStyle === 'chat') {
      const animal = getAnimalAvatar(entry.id);
      return (
        <div className={`flex-shrink-0 ${sizeClass} rounded-full bg-gray-700/50 flex items-center justify-center`}>
          <span className={emojiSizeClass}>{animal}</span>
        </div>
      );
    }

    // 기본 아바타
    return (
      <div className={`flex-shrink-0 ${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold`}>
        {entry.avatar ? (
          <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          entry.name.charAt(0).toUpperCase()
        )}
      </div>
    );
  };

  // 컨테이너 스타일 (배경 이미지 포함)
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }),
  };

  // ========== 카드형 스타일 ==========
  const getCardClass = () => {
    const baseClass = 'p-4 rounded-lg';
    switch (settings.cardStyle) {
      case 'minimal':
        return `${baseClass} bg-transparent border-b border-gray-700/50`;
      case 'bordered':
        return `${baseClass} bg-transparent border border-gray-700`;
      default:
        return `${baseClass} bg-gray-800/50 backdrop-blur-sm`;
    }
  };

  const getGridClass = () => {
    switch (settings.columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1';
    }
  };

  const renderCardStyle = () => (
    <div className={`grid ${getGridClass()} gap-4`}>
      {displayedEntries.map((entry) => (
        <div key={entry.id} className={getCardClass()}>
          <div className="flex items-start gap-3">
            {renderAvatar(entry)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{entry.name}</p>
                {settings.showTimestamp && (
                  <p className="text-xs opacity-50">{formatDate(entry.timestamp)}</p>
                )}
              </div>
              <p className="opacity-80 whitespace-pre-wrap break-words">{entry.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ========== 리스트형 스타일 ==========
  const renderListStyle = () => (
    <div className="space-y-3 bg-gray-800/30 backdrop-blur-sm rounded-lg p-4">
      {displayedEntries.map((entry) => (
        <div key={entry.id} className="flex items-center gap-4 py-3 border-b border-gray-700/50 last:border-0">
          {renderAvatar(entry, 'sm')}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{entry.name}</span>
              {settings.showTimestamp && (
                <span className="text-xs opacity-50">{formatDate(entry.timestamp)}</span>
              )}
            </div>
            <p className="opacity-80 text-sm truncate">{entry.message}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // ========== 채팅형 스타일 ==========
  const renderChatStyle = () => (
    <div className="space-y-4 max-w-2xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6">
      {displayedEntries.map((entry, index) => {
        // 번갈아가며 좌우 배치
        const isLeft = index % 2 === 0;
        return (
          <div key={entry.id} className={`flex items-end gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
            {renderAvatar(entry, 'sm')}
            <div className={`max-w-[70%] ${isLeft ? '' : 'text-right'}`}>
              <p className={`text-xs opacity-70 mb-1 ${isLeft ? '' : 'text-right'}`}>
                {useAnimalAvatars ? getAnimalAvatar(entry.id) : ''} {entry.name}
              </p>
              <div
                className={`inline-block px-4 py-2 rounded-2xl ${
                  isLeft
                    ? 'bg-gray-700 rounded-bl-sm'
                    : 'rounded-br-sm'
                }`}
                style={!isLeft ? { backgroundColor: chatBubbleColor } : undefined}
              >
                <p className="whitespace-pre-wrap break-words text-left">{entry.message}</p>
              </div>
              {settings.showTimestamp && (
                <p className={`text-xs opacity-40 mt-1 ${isLeft ? '' : 'text-right'}`}>
                  {formatDate(entry.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ========== 타임라인형 스타일 ==========
  const renderTimelineStyle = () => (
    <div className="relative max-w-3xl mx-auto">
      {/* 세로 라인 */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform md:-translate-x-1/2" />

      <div className="space-y-8">
        {displayedEntries.map((entry, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={entry.id} className="relative">
              {/* 모바일: 항상 오른쪽 */}
              <div className="md:hidden pl-12">
                <div className="absolute left-2.5 top-2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-gray-900" />
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {renderAvatar(entry, 'sm')}
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <p className="opacity-80 whitespace-pre-wrap break-words">{entry.message}</p>
                  {settings.showTimestamp && (
                    <p className="text-xs opacity-50 mt-2">{formatDate(entry.timestamp)}</p>
                  )}
                </div>
              </div>

              {/* 데스크탑: 교대 배치 */}
              <div className={`hidden md:flex items-start ${isLeft ? '' : 'flex-row-reverse'}`}>
                <div className={`w-[calc(50%-24px)] ${isLeft ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'justify-end' : ''}`}>
                      {!isLeft && renderAvatar(entry, 'sm')}
                      <span className="font-medium">{entry.name}</span>
                      {isLeft && renderAvatar(entry, 'sm')}
                    </div>
                    <p className={`opacity-80 whitespace-pre-wrap break-words ${isLeft ? 'text-right' : ''}`}>
                      {entry.message}
                    </p>
                    {settings.showTimestamp && (
                      <p className={`text-xs opacity-50 mt-2 ${isLeft ? 'text-right' : ''}`}>
                        {formatDate(entry.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
                {/* 중앙 점 */}
                <div className="absolute left-1/2 top-4 w-4 h-4 bg-indigo-500 rounded-full border-4 border-gray-900 transform -translate-x-1/2 z-10" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 레이아웃 형태에 따른 렌더링
  const renderEntries = () => {
    if (displayedEntries.length === 0) {
      return (
        <div className="text-center py-12 opacity-50">
          <p>아직 작성된 방명록이 없습니다.</p>
          <p className="text-sm mt-2">첫 번째 메시지를 남겨주세요!</p>
        </div>
      );
    }

    switch (displayStyle) {
      case 'list':
        return renderListStyle();
      case 'chat':
        return renderChatStyle();
      case 'timeline':
        return renderTimelineStyle();
      default:
        return renderCardStyle();
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center py-16 px-8 relative"
      style={containerStyle}
    >
      {/* 배경 오버레이 (배경 이미지 있을 때) */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      <div className="max-w-6xl w-full relative z-10">
        {/* 제목 및 설명 */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>}
            {description && <p className="text-lg md:text-xl opacity-80">{description}</p>}
          </div>
        )}

        {/* 방명록 입력 폼 */}
        {!isPreview && (
          <form onSubmit={handleSubmit} className="mb-12 max-w-2xl mx-auto">
            <div className="space-y-4 bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
              {(!settings.allowAnonymous || settings.requireName) && (
                <IMEInput
                  value={name}
                  onChange={setName}
                  placeholder={`이름${settings.requireName ? ' (필수)' : ' (선택)'}`}
                  required={settings.requireName}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                  style={{ color: textColor }}
                />
              )}
              <IMETextarea
                value={message}
                onChange={setMessage}
                placeholder="메시지를 남겨주세요..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none"
                style={{ color: textColor }}
              />
              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || (settings.requireName && !name.trim())}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? '전송 중...' : '방명록 남기기'}
              </button>
            </div>
          </form>
        )}

        {/* 방명록 엔트리 목록 */}
        {renderEntries()}

        {/* 더 많은 엔트리가 있을 때 */}
        {entries.length > settings.maxEntries && (
          <p className="text-center mt-8 text-sm opacity-50">
            {entries.length - settings.maxEntries}개의 메시지가 더 있습니다
          </p>
        )}
      </div>
    </section>
  );
};

export default GuestbookLayout;
