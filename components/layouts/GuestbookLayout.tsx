import React, { useState } from 'react';
import { GuestbookEntry, GuestbookSettings } from '../../types';

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
  const sortedEntries = [...entries].sort((a, b) => {
    if (settings.sortOrder === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  // 최대 개수만큼만 표시
  const displayedEntries = sortedEntries.slice(0, settings.maxEntries);

  // 카드 스타일
  const getCardClass = () => {
    const baseClass = 'p-4 rounded-lg';
    switch (settings.cardStyle) {
      case 'minimal':
        return `${baseClass} bg-transparent border-b border-gray-700/50`;
      case 'bordered':
        return `${baseClass} bg-transparent border border-gray-700`;
      default:
        return `${baseClass} bg-gray-800/50`;
    }
  };

  // 그리드 컬럼
  const getGridClass = () => {
    switch (settings.columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1';
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center py-16 px-8"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-6xl w-full">
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
            <div className="space-y-4">
              {(!settings.allowAnonymous || settings.requireName) && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`이름${settings.requireName ? ' (필수)' : ' (선택)'}`}
                  required={settings.requireName}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                  style={{ color: textColor }}
                />
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
        {displayedEntries.length > 0 ? (
          <div className={`grid ${getGridClass()} gap-4`}>
            {displayedEntries.map((entry) => (
              <div key={entry.id} className={getCardClass()}>
                <div className="flex items-start gap-3">
                  {/* 아바타 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      entry.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 이름 및 시간 */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{entry.name}</p>
                      {settings.showTimestamp && (
                        <p className="text-xs opacity-50">
                          {new Date(entry.timestamp).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>

                    {/* 메시지 */}
                    <p className="opacity-80 whitespace-pre-wrap break-words">{entry.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 opacity-50">
            <p>아직 작성된 방명록이 없습니다.</p>
            <p className="text-sm mt-2">첫 번째 메시지를 남겨주세요!</p>
          </div>
        )}

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
