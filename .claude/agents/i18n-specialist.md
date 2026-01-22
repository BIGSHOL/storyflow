# i18n (Internationalization) Specialist Agent

국제화 및 다국어 지원 전문 에이전트입니다.

## 역할

StoryFlow Creator의 다국어 지원, 한국어 IME 처리, 지역화(Localization)를 설계하고 구현합니다.

## 지원 언어

### Phase 1 (현재)
- 🇰🇷 한국어 (ko) - 기본

### Phase 2 (계획)
- 🇺🇸 영어 (en)
- 🇯🇵 일본어 (ja)

### Phase 3 (계획)
- 🇨🇳 중국어 간체 (zh-CN)
- 🇹🇼 중국어 번체 (zh-TW)
- 🇪🇸 스페인어 (es)

## 담당 파일

```
storyflow-creator/
├── locales/
│   ├── ko.json                   # 한국어 번역
│   ├── en.json                   # 영어 번역
│   ├── ja.json                   # 일본어 번역
│   └── index.ts                  # 언어 설정
├── components/
│   ├── KoreanInput.tsx           # 한국어 IME 처리
│   ├── IMEInput.tsx              # 범용 IME 입력
│   └── LanguageSelector.tsx      # 언어 선택기
├── hooks/
│   ├── useTranslation.ts         # 번역 훅
│   └── useLocale.ts              # 로케일 훅
├── contexts/
│   └── LocaleContext.tsx         # 로케일 컨텍스트
└── utils/
    ├── formatters.ts             # 숫자/날짜 포맷터
    └── pluralization.ts          # 복수형 처리
```

## 번역 시스템

### 번역 파일 구조
```json
// locales/ko.json
{
  "common": {
    "save": "저장",
    "cancel": "취소",
    "delete": "삭제",
    "edit": "편집",
    "add": "추가",
    "close": "닫기"
  },
  "editor": {
    "addSection": "섹션 추가",
    "deleteSection": "섹션 삭제",
    "moveUp": "위로 이동",
    "moveDown": "아래로 이동",
    "layout": {
      "hero": "히어로",
      "splitLeft": "이미지 왼쪽",
      "splitRight": "이미지 오른쪽",
      "imageOverlay": "이미지 오버레이",
      "simpleText": "텍스트만"
    },
    "placeholder": {
      "title": "제목을 입력하세요",
      "description": "설명을 입력하세요"
    }
  },
  "preview": {
    "desktop": "데스크탑",
    "tablet": "태블릿",
    "mobile": "모바일",
    "fullscreen": "전체화면"
  },
  "export": {
    "html": "HTML 내보내기",
    "pdf": "PDF 내보내기",
    "png": "PNG 내보내기",
    "exporting": "내보내는 중...",
    "success": "내보내기 완료!",
    "failed": "내보내기 실패"
  },
  "errors": {
    "fileTooLarge": "파일 크기가 너무 커요. {{maxSize}} 이하로 줄여주세요",
    "invalidFileType": "{{types}} 파일만 업로드할 수 있어요",
    "networkError": "인터넷 연결을 확인해주세요",
    "saveError": "저장에 실패했어요. 다시 시도해주세요"
  },
  "tier": {
    "free": "무료",
    "pro": "프로",
    "business": "비즈니스",
    "upgrade": "업그레이드",
    "limitReached": "{{feature}}은(는) {{tier}} 기능이에요"
  }
}
```

```json
// locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "close": "Close"
  },
  "editor": {
    "addSection": "Add Section",
    "deleteSection": "Delete Section",
    "moveUp": "Move Up",
    "moveDown": "Move Down",
    "layout": {
      "hero": "Hero",
      "splitLeft": "Split Left",
      "splitRight": "Split Right",
      "imageOverlay": "Image Overlay",
      "simpleText": "Simple Text"
    },
    "placeholder": {
      "title": "Enter title",
      "description": "Enter description"
    }
  },
  "errors": {
    "fileTooLarge": "File is too large. Please keep it under {{maxSize}}",
    "invalidFileType": "Only {{types}} files are allowed",
    "networkError": "Please check your internet connection",
    "saveError": "Failed to save. Please try again"
  }
}
```

## 번역 훅 구현

```typescript
// hooks/useTranslation.ts
import { useContext, useCallback } from 'react';
import { LocaleContext } from '../contexts/LocaleContext';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

const translations: Record<string, any> = { ko, en };

export const useTranslation = () => {
  const { locale, setLocale } = useContext(LocaleContext);

  // 중첩 키 접근 (e.g., 'editor.addSection')
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing: ${key} (${locale})`);
        return key; // 폴백: 키 반환
      }
    }

    // 파라미터 치환 (e.g., {{maxSize}} → 50MB)
    if (params && typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? p));
    }

    return value;
  }, [locale]);

  return { t, locale, setLocale };
};
```

## 로케일 컨텍스트

```typescript
// contexts/LocaleContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'ko' | 'en' | 'ja';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ko',
  setLocale: () => {},
});

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    // 저장된 언어 설정 확인
    const saved = localStorage.getItem('locale') as Locale;
    if (saved) return saved;

    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0];
    if (['ko', 'en', 'ja'].includes(browserLang)) {
      return browserLang as Locale;
    }

    return 'ko'; // 기본값
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
```

## 한국어 IME 처리

### 문제점
한국어 입력 시 조합 중인 문자가 있으면 `onChange` 이벤트가 여러 번 발생하여 예상치 못한 동작이 발생할 수 있음.

### 해결책
```typescript
// components/IMEInput.tsx
import React, { useState, useRef } from 'react';

interface IMEInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export const IMEInput: React.FC<IMEInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  multiline = false,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent) => {
    setIsComposing(false);
    // 조합 완료 후 최종 값 전달
    onChange((e.target as HTMLInputElement).value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // 조합 중이 아닐 때만 onChange 호출
    if (!isComposing) {
      onChange(e.target.value);
    }
  };

  const Component = multiline ? 'textarea' : 'input';

  return (
    <Component
      ref={inputRef as any}
      value={value}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      placeholder={placeholder}
      className={className}
    />
  );
};
```

## 숫자/날짜 포맷

```typescript
// utils/formatters.ts

export const formatNumber = (value: number, locale: string): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatCurrency = (
  value: number,
  locale: string,
  currency: string = 'KRW'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatRelativeTime = (date: Date, locale: string): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 30) return rtf.format(-diffDay, 'day');

  return formatDate(date, locale);
};
```

## 복수형 처리

```typescript
// utils/pluralization.ts

// 한국어는 복수형이 없음
// 영어는 단수/복수 구분
// 일본어는 복수형이 없음

type PluralRules = {
  zero?: string;
  one?: string;
  other: string;
};

export const pluralize = (
  count: number,
  rules: PluralRules,
  locale: string
): string => {
  // 한국어, 일본어는 항상 other
  if (['ko', 'ja'].includes(locale)) {
    return rules.other.replace('{{count}}', String(count));
  }

  // 영어
  if (count === 0 && rules.zero) {
    return rules.zero;
  }
  if (count === 1 && rules.one) {
    return rules.one.replace('{{count}}', String(count));
  }
  return rules.other.replace('{{count}}', String(count));
};

// 사용 예시
// pluralize(5, {
//   one: '{{count}} project',
//   other: '{{count}} projects',
// }, 'en') // "5 projects"
```

## 언어 선택기

```tsx
// components/LanguageSelector.tsx
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as any)}
      className="bg-gray-800 text-white px-3 py-2 rounded-lg"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
```

## 번역 검증

```typescript
// scripts/validate-translations.ts
// 모든 언어 파일에 동일한 키가 있는지 검증

import ko from '../locales/ko.json';
import en from '../locales/en.json';

const getKeys = (obj: any, prefix = ''): string[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, fullKey);
    }
    return [fullKey];
  });
};

const koKeys = new Set(getKeys(ko));
const enKeys = new Set(getKeys(en));

// 한국어에만 있는 키
const koOnly = [...koKeys].filter(k => !enKeys.has(k));
// 영어에만 있는 키
const enOnly = [...enKeys].filter(k => !koKeys.has(k));

if (koOnly.length > 0) {
  console.warn('Missing in en.json:', koOnly);
}
if (enOnly.length > 0) {
  console.warn('Missing in ko.json:', enOnly);
}
```

## 작업 지침

### 새 텍스트 추가 시
1. 모든 언어 파일에 키 추가
2. t() 함수로 사용
3. 번역 검증 스크립트 실행

### 새 언어 추가 시
1. locales/{lang}.json 파일 생성
2. 모든 키 번역
3. translations 객체에 추가
4. languages 배열에 추가

## 체크리스트

- [ ] 모든 텍스트가 번역 파일에 있는가?
- [ ] 하드코딩된 텍스트가 없는가?
- [ ] IME 입력이 정상 동작하는가?
- [ ] 숫자/날짜 포맷이 올바른가?
- [ ] 번역 키 누락이 없는가?
