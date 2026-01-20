# Supabase Google OAuth 설정 가이드

## 개요
StoryFlow에서 Google 로그인을 사용하기 위한 설정 가이드입니다.

---

## Part 1: Google Cloud Console 설정

### 1-1. Google Cloud Console 접속
- URL: https://console.cloud.google.com/

### 1-2. 프로젝트 생성/선택
1. 상단의 프로젝트 선택 드롭다운 클릭
2. **"새 프로젝트"** 또는 기존 프로젝트 선택

### 1-3. OAuth 동의 화면 설정
1. 좌측 메뉴 > **APIs & Services** > **OAuth consent screen**
2. User Type: **External** 선택 → **CREATE**
3. 필수 정보 입력:
   - App name: `StoryFlow`
   - User support email: 본인 이메일
   - Developer contact: 본인 이메일
4. **SAVE AND CONTINUE** 클릭
5. Scopes: 기본값 유지 → **SAVE AND CONTINUE**
6. Test users: 본인 이메일 추가 (개발 중에만 필요)

### 1-4. OAuth 자격증명 생성
1. 좌측 메뉴 > **APIs & Services** > **Credentials**
2. **+ CREATE CREDENTIALS** > **OAuth client ID**
3. 설정:
   - Application type: **Web application**
   - Name: `StoryFlow Supabase`
   - Authorized JavaScript origins: 
     ```
     http://localhost:3000
     https://upjhgrcjvteegwowyqwa.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://upjhgrcjvteegwowyqwa.supabase.co/auth/v1/callback
     ```
4. **CREATE** 클릭
5. **Client ID**와 **Client Secret** 복사 (중요!)

---

## Part 2: Supabase 설정

### 2-1. Supabase 대시보드 접속
- URL: https://supabase.com/dashboard
- 프로젝트 선택

### 2-2. Google Provider 활성화
1. 좌측 메뉴 > **Authentication** > **Providers**
2. **Google** 클릭
3. 설정:
   - **Enable Google provider**: ✅ ON
   - **Client ID**: Google에서 복사한 Client ID
   - **Client Secret**: Google에서 복사한 Client Secret
4. **Save** 클릭

---

## Part 3: 코드 확인

StoryFlow 코드에서 이미 Google OAuth가 구현되어 있습니다:

```typescript
// services/authService.ts
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { error };
};
```

---

## 완료 확인

1. StoryFlow 앱에서 로그인 버튼 클릭
2. Google 로그인 화면 표시되면 성공!
