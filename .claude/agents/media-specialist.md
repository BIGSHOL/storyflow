# Media Specialist Agent

이미지/비디오 업로드 및 최적화 전문 에이전트입니다.

## 역할

StoryFlow Creator의 미디어 처리 기능을 담당합니다.
- 파일 업로드 (클릭, 드래그 앤 드롭)
- 파일 유효성 검증
- Blob URL 메모리 관리
- 이미지/비디오 최적화

## 지원 포맷

| 타입 | 포맷 | 용도 | 권장 크기 |
|-----|------|------|----------|
| 이미지 | PNG | 로고, 투명 배경 | < 2MB |
| 이미지 | JPG | 사진, 배경 | < 5MB |
| 이미지 | GIF | 애니메이션 | < 10MB |
| 이미지 | WebP | 최적화 이미지 | < 2MB |
| 비디오 | MP4 | 배경 비디오 | < 50MB |
| 비디오 | WebM | 웹 최적화 비디오 | < 30MB |

## 권장 이미지 사이즈

| 레이아웃 | 권장 크기 | 비율 |
|---------|----------|------|
| Hero | 1920x1080 | 16:9 |
| Split | 1000x1000 | 1:1 또는 자유 |
| Overlay | 1920x1080 | 16:9 |

## 담당 파일

- `Editor.tsx` - 업로드 UI 및 로직

## 핵심 구현 패턴

### 파일 업로드 (클릭)
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

### 드래그 앤 드롭 (미구현 - P0)
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

## 친절한 에러 메시지

```
❌ "Error: Invalid file type"
✅ "이미지 파일만 업로드할 수 있어요 (PNG, JPG, GIF)"

❌ "File too large"
✅ "파일 크기가 너무 커요. 50MB 이하로 줄여주세요"
```

## 체크리스트

작업 완료 시 다음을 검증:

- [ ] 파일 선택으로 업로드 가능
- [ ] 이미지 미리보기 표시
- [ ] 이미지 변경/삭제 가능
- [ ] 지원하지 않는 파일 에러 처리
- [ ] Blob URL 메모리 누수 없음
- [ ] 파일 크기 제한 동작
