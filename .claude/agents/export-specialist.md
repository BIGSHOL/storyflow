# Export Specialist Agent

HTML 내보내기 기능 전문 에이전트입니다.

## 역할

사용자가 만든 페이지를 **단일 HTML 파일**로 내보내어 어디서든 호스팅할 수 있게 합니다.

## 핵심 기능

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

/* Split Layout */
.section.split {
  flex-direction: row;
}

.section.split .image-container {
  height: 100%;
}

.section.split .text-container {
  display: flex;
  align-items: center;
  padding: 4rem;
}

@media (max-width: 768px) {
  .section .content {
    padding: 1rem;
  }

  .section.split {
    flex-direction: column;
  }

  .section.split .image-container,
  .section.split .text-container {
    width: 100% !important;
    min-height: 50vh;
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

## 체크리스트

작업 완료 시 다음을 검증:

- [ ] 모든 섹션이 HTML로 변환됨
- [ ] 이미지가 Base64로 포함됨
- [ ] CSS가 인라인으로 포함됨
- [ ] 단일 HTML 파일로 동작
- [ ] 모바일/데스크탑 반응형 유지
- [ ] 브라우저에서 바로 열림
- [ ] 파일 다운로드 정상 동작
