# Integration Validator Command

StoryFlow Creator 코드 품질 및 통합 검증 커맨드입니다.

## 사용법

```
/validate
```

## 역할

코드 변경 후 전체 프로젝트의 품질과 정합성을 검증합니다.

## 기술 스택

- TypeScript (Deno runtime for Edge Functions)
- React 19 + Vite 6
- Supabase PostgreSQL with RLS
- Supabase Auth
- Tailwind CSS

## 검증 항목

### 1. 빌드 및 테스트 검증

```bash
npx tsc --noEmit  # TypeScript 타입 검사
npm run build     # Vite 프로덕션 빌드
npm run test      # Vitest 테스트 실행
```

### 2. 타입 일관성 검증

- [ ] Supabase 생성 타입과 프론트엔드 타입 일치
- [ ] Edge Functions 응답과 API 클라이언트 타입 일치
- [ ] RLS 정책과 API 접근 권한 일치

### 3. 수익화 기능 검증

#### 플랜 제한 시스템
- [ ] 프로젝트 개수 제한 동작
- [ ] 일일 내보내기 제한 동작
- [ ] 협업자 수 제한 동작
- [ ] 브랜딩 제거 옵션 동작

#### 구독 UI
- [ ] PlanBadge 컴포넌트 렌더링
- [ ] UsageBar 컴포넌트 렌더링
- [ ] UpgradeModal 비공격적 UX
- [ ] PricingCard 플랜 비교 표시

### 4. UX 체크리스트

#### 노코드 사용성
- [ ] 첫 화면에서 바로 시작 가능
- [ ] 모든 기능이 마우스로 조작 가능
- [ ] 전문 용어 없이 이해 가능
- [ ] 에러 메시지가 친절함

#### 비공격적 업셀 UX
- [ ] X 버튼 항상 표시
- [ ] "나중에" 버튼 눈에 잘 보임
- [ ] 배경 클릭으로 모달 닫기 가능
- [ ] 강요하지 않는 문구 사용

### 5. 레이아웃 검증

- [ ] Hero 레이아웃 정상 렌더링
- [ ] Split Left/Right 레이아웃 정상 렌더링
- [ ] Image Overlay 레이아웃 정상 렌더링
- [ ] Simple Text 레이아웃 정상 렌더링

### 6. API 계약 검증

- [ ] Request/Response 타입 검증
- [ ] 에러 응답 형식 일관성
- [ ] 인증/인가 흐름 일관성

## 검증 프로세스

```
/validate 실행
    ↓
[1] TypeScript 타입 검사
    ↓
[2] Vitest 테스트 실행
    ↓
[3] Vite 빌드 테스트
    ↓
[4] 체크리스트 항목 확인
    ↓
결과 보고
```

## 출력 형식

```
=== StoryFlow Creator 검증 결과 ===

TypeScript: 에러 없음
Vitest: 15/15 테스트 통과
Vite Build: 성공

수익화 기능:
- 플랜 제한 시스템 - 정상
- 구독 UI 컴포넌트 - 정상
- 비공격적 업셀 UX - 통과

타입 일관성:
- Supabase 타입 - 일치
- API 응답 타입 - 일치
- RLS 정책 - 정상

=== 검증 완료 ===
```

## 금지사항

- 직접 코드 수정 (제안만 제공)
- 아키텍처 변경 제안
- 새로운 의존성 추가 제안
