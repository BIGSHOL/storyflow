# Orchestrator Command

StoryFlow Creator 에이전트 팀을 조율하는 오케스트레이터입니다.

## 사용법

```
/orchestrate <작업 설명>
```

## 역할

사용자 요청을 분석하여 적절한 에이전트에게 작업을 분배하고, 결과를 통합합니다.

## 에이전트 팀

| 에이전트 | 역할 | 담당 파일 |
|---------|------|----------|
| UX Specialist | 노코드 사용자를 위한 직관적 UI/UX | 전체 UX 검토 |
| Frontend Specialist | React 컴포넌트 개발 | App.tsx, Editor.tsx, PreviewRender.tsx, types.ts |
| Media Specialist | 이미지/비디오 업로드 및 최적화 | Editor.tsx (업로드 로직) |
| Export Specialist | HTML 내보내기 기능 | (별도 export 로직) |

## 작업 유형별 분배

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
[1] 요청 분석 - 필요한 에이전트 식별
    ↓
[2] UX Specialist 검토 (필요시)
    ↓
[3] 담당 에이전트에게 작업 분배
    ↓
[4] 결과 통합 및 검증
    ↓
완료
```

## 오케스트레이션 프로세스

### 1단계: 요청 분석

사용자 요청을 분석하여 다음을 결정:
- 관련 에이전트 식별
- 작업 순서 결정
- 병렬 실행 가능 여부 확인

### 2단계: 에이전트 호출

Task 도구를 사용하여 에이전트를 호출합니다:

```
Task 호출 시:
- subagent_type: "general-purpose"
- prompt: 에이전트 파일 내용 + 구체적 작업 지시
```

### 3단계: 결과 통합

각 에이전트의 결과를 수집하고:
- 충돌 여부 확인
- 통합 테스트 실행
- 사용자에게 결과 보고

## 충돌 해결 규칙

- **UX vs 기술**: UX 우선 (노코드 사용자 경험이 최우선)
- **성능 vs 기능**: 균형 (60fps 유지하면서 기능 추가)

## 검증 체크리스트

작업 완료 전 확인:

```bash
npx tsc --noEmit  # TypeScript 검사
npm run build     # Vite 빌드
```

- [ ] TypeScript 에러 없음
- [ ] 빌드 성공
- [ ] 기존 기능 정상 동작
- [ ] 새 기능 정상 동작

## 예시

### 예시 1: "드래그 앤 드롭 이미지 업로드 추가"

```
1. UX Specialist 호출
   - 드래그 앤 드롭 UX 가이드라인 확인
   - 시각적 피드백 요구사항 정의

2. Media Specialist 호출
   - 파일 드롭 핸들러 구현
   - 파일 유효성 검증 로직

3. Frontend Specialist 호출
   - Editor.tsx에 드롭존 UI 추가
   - 드래그 시 시각적 피드백 스타일

4. 통합 검증
   - 전체 플로우 테스트
   - 빌드 확인
```

### 예시 2: "HTML 내보내기 기능 추가"

```
1. Export Specialist 호출
   - HTML 생성 로직 구현
   - Base64 이미지 변환 로직

2. Frontend Specialist 호출
   - 내보내기 버튼 UI 추가
   - 다운로드 트리거 연결

3. UX Specialist 호출
   - 버튼 위치/레이블 검토
   - 진행 상태 표시 방법 검토

4. 통합 검증
   - 실제 내보내기 테스트
   - 다양한 섹션 조합 테스트
```
