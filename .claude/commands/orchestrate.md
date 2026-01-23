# Orchestrator Command

StoryFlow Creator 에이전트 팀을 조율하는 오케스트레이터입니다.
**Phase 번호에 따라 Git Worktree와 TDD 정보를 자동으로 서브에이전트에 전달합니다.**

## 사용법

```
/orchestrate <작업 설명>
```

## 역할

사용자 요청을 분석하여 적절한 에이전트에게 작업을 분배하고, 결과를 통합합니다.

## 워크플로우

### 1단계: 컨텍스트 파악

기획 문서를 확인합니다:
- `docs/planning/06-tasks.md` - 마일스톤, 태스크 목록
- `docs/planning/01-prd.md` - 요구사항 정의
- `docs/planning/02-trd.md` - 기술 요구사항

### 2단계: 작업 분석

사용자 요청을 분석하여:
1. 어떤 태스크(Phase N, TN.X)에 해당하는지 파악
2. **Phase 번호 추출** (Git Worktree 결정에 필수!)
3. 필요한 전문 분야 결정
4. 의존성 확인
5. 병렬 가능 여부 판단

## 에이전트 팀

| 에이전트 | 역할 | 담당 영역 |
|---------|------|----------|
| Supabase Specialist | Edge Functions, DB, RLS | 백엔드 API, 인증, 데이터베이스 |
| Database Specialist | PostgreSQL, 마이그레이션, RLS | 스키마 설계, 마이그레이션 |
| Frontend Specialist | React 컴포넌트 개발 | UI 컴포넌트, 상태관리 |
| Test Specialist | 테스트 작성, Mock 생성 | TDD, 품질 게이트 |
| UX Specialist | 노코드 사용자를 위한 직관적 UI/UX | 전체 UX 검토 |
| Media Specialist | 이미지/비디오 업로드 및 최적화 | 미디어 처리 |
| Export Specialist | HTML 내보내기 기능 | 내보내기 로직 |

## Phase 기반 Git Worktree 규칙 (필수!)

| Phase | Git Worktree | 설명 |
|-------|-------------|------|
| Phase 0 | 생성 안함 | main 브랜치에서 직접 작업 |
| Phase 1+ | **자동 생성** | 별도 worktree에서 작업 |

### Phase 번호 추출 방법

태스크 ID에서 Phase 번호를 추출합니다:
- `Phase 0, T0.1` → Phase 0
- `Phase 1, T1.1` → Phase 1
- `Phase 2, T2.3` → Phase 2

## 수익화 기능 작업 분배

| 작업 | 담당 에이전트 |
|------|-------------|
| 구독 API, Edge Functions | Supabase Specialist |
| DB 스키마, RLS 정책 | Database Specialist |
| 플랜 배지, 업그레이드 모달 UI | Frontend Specialist |
| 플랜 제한 로직 | Supabase + Frontend |
| 테스트 작성 | Test Specialist |
| 비공격적 UX 검토 | UX Specialist |

## Task 도구 호출 형식

### Phase 0 태스크 (Worktree 없음)

```
Task tool parameters:
- subagent_type: "supabase-specialist"
- description: "Phase 0, T0.1: 프로젝트 구조 초기화"
- prompt: |
    ## 태스크 정보
    - Phase: 0
    - 태스크 ID: T0.1
    - 태스크명: 프로젝트 구조 초기화

    ## Git Worktree
    Phase 0이므로 main 브랜치에서 직접 작업합니다.

    ## 작업 내용
    {상세 작업 지시사항}
```

### Phase 1+ 태스크 (Worktree + TDD 필수)

```
Task tool parameters:
- subagent_type: "supabase-specialist"
- description: "Phase 1, T1.1: 구독 서비스 구현"
- prompt: |
    ## 태스크 정보
    - Phase: 1
    - 태스크 ID: T1.1
    - 태스크명: 구독 서비스 구현

    ## Git Worktree 설정 (Phase 1+ 필수!)
    작업 시작 전 반드시 Worktree를 생성하세요:
    git worktree add ../storyflow-phase1-subscription -b phase/1-subscription
    cd ../storyflow-phase1-subscription

    ## TDD 요구사항 (Phase 1+ 필수!)
    반드시 TDD 사이클을 따르세요:
    1. RED: 테스트 먼저 작성
    2. GREEN: 테스트 통과하는 최소 구현
    3. REFACTOR: 테스트 유지하며 코드 정리

    ## 작업 내용
    {상세 작업 지시사항}
```

## 병렬 실행

의존성이 없는 작업은 **동시에 여러 Task 도구를 호출**하여 병렬로 실행합니다.

## 검증 체크리스트

작업 완료 전 확인:

```bash
npx tsc --noEmit  # TypeScript 검사
npm run build     # Vite 빌드
npm run test      # 테스트 실행
```

- [ ] TypeScript 에러 없음
- [ ] 빌드 성공
- [ ] 테스트 통과
- [ ] 기존 기능 정상 동작

## 완료 보고 확인

서브에이전트의 완료 보고를 받으면:

1. **TDD 결과 확인**: RED → GREEN 달성 여부
2. **Git Worktree 상태 확인**: 브랜치, 경로
3. **사용자에게 병합 승인 요청**

**중요: 사용자 승인 없이 절대 병합 명령을 실행하지 않습니다!**
