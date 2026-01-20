# Vercel 배포 가이드

## 개요
StoryFlow를 Vercel에 배포하여 전세계에서 접속 가능한 URL을 받습니다.

---

## 배포 단계

### 1. Vercel 가입/로그인
- URL: https://vercel.com/
- **Continue with GitHub** 클릭 (GitHub 계정으로 로그인)

### 2. 프로젝트 Import
1. 대시보드에서 **Add New...** > **Project** 클릭
2. **Import Git Repository** 섹션에서
3. **BIGSHOL/storyflow** 저장소 선택 > **Import**

### 3. 환경 변수 설정 (중요!)
Build & Development Settings 화면에서 **Environment Variables** 추가:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://upjhgrcjvteegwowyqwa.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (Supabase에서 복사한 anon key) |

### 4. 배포
**Deploy** 버튼 클릭 → 1~2분 후 배포 완료!

---

## 배포 후 설정

### Google OAuth Redirect URI 추가
Vercel 배포 URL을 받으면 (예: `storyflow-xxx.vercel.app`):

1. **Google Cloud Console** > Credentials > OAuth 2.0 Client
2. **Authorized redirect URIs**에 추가:
   ```
   https://upjhgrcjvteegwowyqwa.supabase.co/auth/v1/callback
   ```
   (이미 설정되어 있다면 그대로 유지)

3. **Authorized JavaScript origins**에 추가:
   ```
   https://storyflow-xxx.vercel.app
   ```
   (실제 Vercel 도메인으로 교체)

---

## 결과
- 배포 URL: `https://storyflow.vercel.app` (또는 유사한 URL)
- GitHub 푸시 시 자동 재배포
