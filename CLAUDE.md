# StoryFlow Creator

**"코딩 없이 누구나 쉽게, 이미지로 웹페이지 만들기"**

참고 스타일: suzag.com - 세로 스크롤 기반 스토리텔링 페이지

---

## 프로젝트 비전

코딩을 전혀 모르는 사람도 자신의 이미지와 텍스트만으로 멋진 웹페이지를 만들 수 있는 노코드 웹 빌더입니다.

### 핵심 가치
1. **쉬움** - 드래그 앤 드롭, 클릭 몇 번으로 완성
2. **직관적** - 보이는 그대로 편집 (WYSIWYG)
3. **아름다움** - 전문가 수준의 레이아웃 템플릿 제공
4. **즉시 확인** - 실시간 프리뷰로 결과 즉시 확인
5. **바로 배포** - HTML 내보내기로 어디서든 사용

### 타겟 사용자
- 코딩을 전혀 모르는 일반인
- 컴퓨터 사용에 익숙하지 않은 사람
- 빠르게 포트폴리오/소개 페이지가 필요한 사람
- 이미지 중심의 스토리텔링 페이지를 만들고 싶은 사람
- 소상공인, 프리랜서, 학생

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS (인라인 클래스) |
| Icons | Lucide React |
| State | React useState (로컬 상태) |

---

## 프로젝트 구조

```
storyflow-creator/
├── App.tsx              # 메인 앱, sections 상태 관리
├── components/
│   ├── Editor.tsx       # 왼쪽 편집 패널
│   └── PreviewRender.tsx # 오른쪽 실시간 프리뷰
├── types.ts             # Section, LayoutType 타입
├── index.tsx            # 엔트리 포인트
└── index.html           # HTML + 커스텀 CSS 애니메이션
```

---

## 핵심 타입

```typescript
enum LayoutType {
  HERO = 'hero',                           // 전체화면 히어로
  SPLIT_LEFT = 'split_left',               // 이미지 왼쪽
  SPLIT_RIGHT = 'split_right',             // 이미지 오른쪽
  FULL_IMAGE_TEXT_OVERLAY = 'full_image_overlay', // 이미지+오버레이
  SIMPLE_TEXT = 'simple_text',             // 텍스트만
}

interface Section {
  id: string;
  layout: LayoutType;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  backgroundColor?: string;
  textColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  splitRatio?: number;      // 분할 비율 (20-80)
  overlayOpacity?: number;  // 오버레이 투명도 (0-1)
}
```

---

## 레이아웃 템플릿

| 레이아웃 | 용도 | 설명 |
|---------|------|------|
| Hero | 첫 화면, 메인 | 전체화면 이미지 + 중앙 텍스트 |
| Split Left | 소개, 설명 | 왼쪽 이미지 + 오른쪽 텍스트 |
| Split Right | 소개, 설명 | 오른쪽 이미지 + 왼쪽 텍스트 |
| Image Overlay | 강조, 인용 | 배경 이미지 위 텍스트 오버레이 |
| Simple Text | 본문, 마무리 | 텍스트만 중앙 정렬 |

---

## 개발 명령어

```bash
npm install    # 의존성 설치
npm run dev    # 개발 서버 (http://localhost:5173)
npm run build  # 프로덕션 빌드
npx tsc --noEmit  # 타입 검사
```

---

# UX 가이드라인

## 핵심 UX 원칙

### 1. 제로 러닝 커브
- 설명서 없이도 바로 사용 가능
- 모든 기능은 시각적으로 명확
- 첫 화면에서 바로 시작 가능

### 2. 직관적 인터랙션
- 드래그 앤 드롭으로 이미지 추가
- 클릭으로 텍스트 편집
- 슬라이더로 값 조절

### 3. 즉각적 피드백
- 모든 변경은 실시간으로 반영
- 로딩 중일 때 명확한 표시
- 성공/실패 시 시각적 알림

### 4. 실수 방지 & 복구
- 삭제 전 확인 다이얼로그
- Undo/Redo 기능 (Ctrl+Z/Y)
- 자동 저장 (3초 후)

## 세로 스크롤 스토리텔링 UX

### 페이지 구조
```
[Hero 섹션] - 첫 인상, 전체화면
    ↓ 스크롤
[섹션 2] - 스토리 전개
    ↓ 스크롤
[섹션 3] - 상세 내용
    ↓ 스크롤
[섹션 N] - 마무리/CTA
    ↓
[Footer]
```

### 스크롤 경험
- 부드러운 스크롤 (scroll-smooth)
- 섹션별 스냅 (선택적)
- 스크롤 진행률 표시 (선택적)
- 첫 화면에 "아래로 스크롤" 힌트

### 시각적 고급스러움
- 충분한 여백 (패딩, 마진)
- 큰 타이포그래피 (제목: 5-7xl)
- 고화질 전체화면 이미지
- 미묘한 애니메이션 (fade-in, slide-up)
- 오버레이로 텍스트 가독성 확보

## UX DO & DON'T

### DO (해야 할 것)
- 모든 기능은 마우스 클릭/드래그로 가능하게
- 아이콘 + 텍스트 라벨 함께 사용
- 실시간 피드백 제공
- 실수해도 쉽게 되돌리기 가능

### DON'T (하지 말 것)
- 코드 입력 요구하지 않기
- 복잡한 설정 메뉴 만들지 않기
- 전문 용어 사용하지 않기
- 사용자를 기다리게 하지 않기

## 친절한 에러 메시지

```
❌ "Error: Invalid file type"
✅ "이미지 파일만 업로드할 수 있어요 (PNG, JPG, GIF)"

❌ "Network Error"
✅ "인터넷 연결을 확인해주세요"

❌ "File too large"
✅ "파일 크기가 너무 커요. 50MB 이하로 줄여주세요"
```

---

# Frontend 개발 가이드

## 세로 스크롤 스토리텔링 구현

### PreviewRender.tsx 핵심 패턴
```tsx
// 각 섹션이 전체 화면(100vh) 또는 최소 높이를 가짐
<section className="min-h-screen">
  {/* 콘텐츠 */}
</section>

// 부드러운 스크롤
<div className="scroll-smooth">

// 스크롤 힌트 (첫 섹션)
<div className="animate-bounce">
  <ChevronDown />
</div>
```

### 레이아웃별 구현

#### Hero (전체화면)
```tsx
<section className="relative w-full h-screen">
  <img className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-black/50" /> {/* 오버레이 */}
  <div className="relative z-10 flex flex-col justify-center items-center h-full">
    <h1 className="text-5xl md:text-7xl">{title}</h1>
    <p className="text-xl md:text-2xl">{description}</p>
  </div>
</section>
```

#### Split (분할)
```tsx
<section className="min-h-screen flex flex-col md:flex-row">
  <div style={{ width: `${splitRatio}%` }}>
    <img className="w-full h-full object-cover" />
  </div>
  <div style={{ width: `${100 - splitRatio}%` }} className="flex items-center p-16">
    <div>
      <h2 className="text-3xl md:text-5xl">{title}</h2>
      <p>{description}</p>
    </div>
  </div>
</section>
```

## 스타일링 규칙

### Tailwind 클래스 패턴
```tsx
// 다크 테마 기본
className="bg-gray-900 text-white"

// 반응형 (모바일 → 데스크탑)
className="text-3xl md:text-5xl"  // 모바일: 3xl, 데스크탑: 5xl
className="flex-col md:flex-row"  // 모바일: 세로, 데스크탑: 가로

// 고급스러운 타이포그래피
className="font-serif font-bold tracking-tight leading-tight"

// 애니메이션
className="animate-slide-up animate-fade-in"
```

### 고급스러움을 위한 스타일
- 큰 폰트 사이즈 (제목: text-5xl ~ text-7xl)
- 충분한 여백 (px-8 md:px-24, py-16 md:py-32)
- 세리프 폰트 (font-serif)
- 미묘한 애니메이션
- 이미지 오버레이로 텍스트 가독성 확보

## 작업 지침

### 새 기능 추가 시
1. types.ts에 필요한 타입 추가
2. PreviewRender.tsx에 렌더링 로직 추가
3. Editor.tsx에 편집 UI 추가
4. 실시간 프리뷰 연동 확인

### 컴포넌트 수정 시
1. 기존 패턴 유지 (useState, 인라인 Tailwind)
2. TypeScript 타입 엄격히 적용
3. 반응형 디자인 항상 고려

### 코드 품질 체크리스트
- [ ] TypeScript 에러 없음 (npx tsc --noEmit)
- [ ] 반응형 디자인 적용 (모바일/데스크탑)
- [ ] 세로 스크롤 UX 유지
- [ ] 60fps 스크롤 성능
- [ ] 접근성 (시맨틱 HTML)

---

# 미디어 관리 가이드

## 지원 포맷

| 타입 | 포맷 | 용도 | 권장 크기 |
|-----|------|------|----------|
| 이미지 | PNG | 로고, 투명 배경 | < 2MB |
| 이미지 | JPG | 사진, 배경 | < 5MB |
| 이미지 | GIF | 애니메이션 | < 10MB |
| 이미지 | WebP | 최적화 이미지 | < 2MB |
| 비디오 | MP4 | 배경 비디오 | < 50MB |
| 비디오 | WebM | 웹 최적화 비디오 | < 30MB |

## 이미지 업로드 구현

### 현재 구현 (클릭 업로드)
```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 파일 타입 검증
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    alert('이미지 또는 비디오 파일만 업로드할 수 있어요');
    return;
  }

  // 파일 크기 검증
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_SIZE) {
    alert('파일 크기가 너무 커요. 50MB 이하로 줄여주세요');
    return;
  }

  // 이전 Blob URL 해제 (메모리 누수 방지)
  const currentSection = sections.find(s => s.id === id);
  if (currentSection?.mediaUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(currentSection.mediaUrl);
  }

  const url = URL.createObjectURL(file);
  updateSection(id, {
    mediaUrl: url,
    mediaType: file.type.startsWith('video') ? 'video' : 'image'
  });
};
```

### 구현 완료 (드래그 앤 드롭)
```typescript
const handleDrop = (e: React.DragEvent, id: string) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
    // 기존 URL 해제
    const currentSection = sections.find(s => s.id === id);
    if (currentSection?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(currentSection.mediaUrl);
    }

    const url = URL.createObjectURL(file);
    updateSection(id, {
      mediaUrl: url,
      mediaType: file.type.startsWith('video') ? 'video' : 'image'
    });
  }
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  // 드래그 중 시각적 피드백 추가
};
```

## 권장 이미지 사이즈

| 레이아웃 | 권장 크기 | 비율 |
|---------|----------|------|
| Hero | 1920x1080 | 16:9 |
| Split | 1000x1000 | 1:1 또는 자유 |
| Overlay | 1920x1080 | 16:9 |

## 메모리 관리 (중요!)

### Blob URL 정리
```typescript
// 이미지 변경 시 기존 URL 해제
const updateMedia = (id: string, newUrl: string) => {
  const section = sections.find(s => s.id === id);
  if (section?.mediaUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(section.mediaUrl);
  }
  updateSection(id, { mediaUrl: newUrl });
};

// 섹션 삭제 시 정리
const deleteSection = (id: string) => {
  const section = sections.find(s => s.id === id);
  if (section?.mediaUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(section.mediaUrl);
  }
  setSections(prev => prev.filter(s => s.id !== id));
};
```

---

# HTML 내보내기 가이드

## 핵심 기능

사용자가 만든 페이지를 **단일 HTML 파일**로 내보내어 어디서든 호스팅할 수 있게 합니다.

- 모든 섹션을 포함한 완전한 HTML 파일 생성
- 이미지를 Base64로 인라인 포함
- CSS 스타일 인라인 포함
- 외부 의존성 없이 독립 실행 가능

## 구현 방법

### 1. 섹션 → HTML 변환
```typescript
const sectionToHTML = (section: Section): string => {
  switch (section.layout) {
    case LayoutType.HERO:
      return `
        <section class="section hero" style="background-color: ${section.backgroundColor};">
          ${section.mediaUrl ? `<img src="${section.mediaUrl}" alt="${section.title}" class="bg-image" />` : ''}
          <div class="overlay" style="opacity: ${section.overlayOpacity};"></div>
          <div class="content" style="text-align: ${section.textAlignment}; color: ${section.textColor};">
            <h1>${section.title}</h1>
            <p>${section.description}</p>
          </div>
        </section>
      `;
    // ... 다른 레이아웃들
  }
};
```

### 2. 이미지 → Base64 변환
```typescript
const imageToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
```

### 3. 전체 HTML 생성
```typescript
const generateHTML = async (sections: Section[]): Promise<string> => {
  // 이미지 Base64 변환
  const sectionsWithBase64 = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      mediaUrl: section.mediaUrl
        ? await imageToBase64(section.mediaUrl)
        : undefined,
    }))
  );

  const sectionsHTML = sectionsWithBase64.map(sectionToHTML).join('\n');

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Story</title>
      <style>${CSS_STYLES}</style>
    </head>
    <body>
      ${sectionsHTML}
      <footer class="footer">
        <p>Made with StoryFlow</p>
      </footer>
    </body>
    </html>
  `;
};
```

### 4. 파일 다운로드
```typescript
const downloadHTML = (html: string, filename: string = 'my-story.html') => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
```

## 내보낼 CSS 스타일

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: Georgia, 'Times New Roman', serif;
  background-color: #000;
  color: #fff;
  line-height: 1.6;
}

.section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.section .bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section .overlay {
  position: absolute;
  inset: 0;
  background-color: #000;
}

.section .content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  padding: 2rem;
}

.section h1 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.section p {
  font-size: clamp(1rem, 3vw, 1.5rem);
  opacity: 0.9;
  max-width: 600px;
}

@media (max-width: 768px) {
  .section .content {
    padding: 1rem;
  }
}

.footer {
  padding: 2rem;
  text-align: center;
  background: #111;
  color: #666;
  font-size: 0.875rem;
}
```

---

# 에이전트 작업 분배

## 에이전트 역할

| 에이전트 | 역할 | 담당 파일 |
|---------|------|----------|
| UX Specialist | 노코드 사용자를 위한 직관적 UI/UX | 전체 UX 검토 |
| Frontend Specialist | React 컴포넌트 개발 | App.tsx, Editor.tsx, PreviewRender.tsx, types.ts |
| Media Specialist | 이미지/비디오 업로드 및 최적화 | Editor.tsx (업로드 로직) |
| Export Specialist | HTML 내보내기 기능 | (별도 export 로직) |

## 작업 유형별 담당

| 작업 | 담당 에이전트 |
|------|-------------|
| UI 개선, 버튼 추가 | UX + Frontend |
| 새 레이아웃 추가 | Frontend |
| 이미지 업로드 기능 | Media + Frontend |
| 드래그 앤 드롭 | UX + Media |
| HTML 내보내기 | Export |
| 성능 최적화 | Frontend + Media |

## 작업 흐름

```
사용자 요청
    ↓
UX Specialist (검토)
    ↓
Frontend/Media/Export (구현)
    ↓
통합 테스트
    ↓
완료
```

## 충돌 해결

- **UX vs 기술**: UX 우선 (노코드 사용자 경험이 최우선)
- **성능 vs 기능**: 균형 (60fps 유지하면서 기능 추가)

---

# 통합 검증 체크리스트

## 빌드 검증
```bash
npm run build  # Vite 빌드
npx tsc --noEmit  # TypeScript 검사
```

## UX 체크리스트

### 노코드 사용성
- [ ] 첫 화면에서 바로 시작 가능
- [ ] 모든 기능이 마우스로 조작 가능
- [ ] 전문 용어 없이 이해 가능
- [ ] 에러 메시지가 친절함

### 세로 스크롤 경험
- [ ] 부드러운 스크롤 동작
- [ ] 각 섹션이 적절한 높이 (min-h-screen)
- [ ] 첫 화면에 스크롤 힌트 표시
- [ ] 모바일에서도 정상 동작

### 레이아웃 검증
- [ ] Hero 레이아웃 정상 렌더링
- [ ] Split Left 레이아웃 정상 렌더링
- [ ] Split Right 레이아웃 정상 렌더링
- [ ] Image Overlay 레이아웃 정상 렌더링
- [ ] Simple Text 레이아웃 정상 렌더링

### 이미지 업로드
- [ ] 파일 선택으로 업로드 가능
- [ ] 이미지 미리보기 표시
- [ ] 이미지 변경/삭제 가능
- [ ] 지원하지 않는 파일 에러 처리

### 편집 기능
- [ ] 제목/설명 텍스트 편집
- [ ] 레이아웃 변경
- [ ] 색상 변경 (배경/텍스트)
- [ ] 투명도 조절 슬라이더
- [ ] 섹션 순서 변경 (위/아래)
- [ ] 섹션 삭제

### 프리뷰 기능
- [ ] 실시간 프리뷰 반영
- [ ] 데스크탑/모바일 전환
- [ ] 전체화면 프리뷰 모드

---

# 현재 상태 및 미구현 기능

## 구현 완료
- [x] 섹션 추가/삭제
- [x] 레이아웃 변경 (5종류)
- [x] 이미지 업로드 (클릭)
- [x] 실시간 프리뷰
- [x] 데스크탑/모바일 전환
- [x] 전체화면 프리뷰 모드
- [x] 텍스트/색상/투명도 편집
- [x] HTML 내보내기 기능 (services/exportService.ts)
- [x] 드래그 앤 드롭 이미지 업로드 (Editor.tsx)
- [x] 프로젝트 저장/불러오기 (services/storageService.ts)
- [x] 자동 저장 (3초 후 자동 저장)
- [x] Undo/Redo (Ctrl+Z/Y 단축키 지원)
- [x] 섹션 드래그 순서 변경
- [x] 이미지 최적화 (services/imageOptimizer.ts)
- [x] 템플릿 기능 (data/templates.ts)
- [x] 타이포그래피 커스터마이징 (Google Fonts 지원)
- [x] 텍스트 그림자, 그라데이션 오버레이
- [x] 이미지 필터 (흑백, 세피아, 블러 등)
- [x] 애니메이션 효과 (페이드 인, 슬라이드 등)
- [x] CTA 버튼 추가 기능
- [x] 9방향 텍스트 위치 조절

## 미구현 (우선순위)

### P2 (선택)
- [ ] 이미지 크롭 기능
- [ ] 추가 레이아웃 (Gallery 등)
