# Supabase Storage 버킷 생성 가이드

## 개요
StoryFlow에서 이미지/비디오 업로드를 위한 Storage 버킷을 생성합니다.

---

## 생성 단계

### 1. Supabase 대시보드 접속
- URL: https://supabase.com/dashboard
- 프로젝트: `upjhgrcjvteegwowyqwa` 선택

### 2. Storage 메뉴 이동
- 좌측 사이드바 > **Storage** 클릭

### 3. 버킷 생성
1. **"New bucket"** 버튼 클릭
2. 다음 설정 입력:

| 항목 | 값 |
|-----|-----|
| **Name** | `media` (정확히 이 이름!) |
| **Public bucket** | ✅ ON |
| **File size limit** | `52428800` (50MB, 선택사항) |

3. **"Create bucket"** 클릭

---

## 완료 확인

버킷 목록에 다음이 표시되면 성공:
```
📦 media (Public)
```

---

## 참고
- 버킷 이름은 반드시 `media`여야 함 (코드와 일치)
- Storage 정책은 `schema.sql` 실행 시 자동 생성됨
