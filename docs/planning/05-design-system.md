# Design System (기초 디자인 시스템)

> StoryFlow Creator 수익화 기능 - UI 디자인 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 지속 가능한 서비스 운영을 위한 수익화 기능 구현 |
| 2 | 페르소나 | 간단한 개인 페이지가 필요한 누구나 |
| 3 | 핵심 기능 | FEAT-1: 플랜별 기능 제한 시스템 |
| 4 | 성공 지표 (노스스타) | 월 유료 구독자 수 |
| 5 | 입력 지표 | 무료→유료 전환율, 플랜 업그레이드 클릭 수 |
| 6 | 비기능 요구 | 결제 처리 응답 시간 < 3초 |
| 7 | Out-of-scope | 커스텀 도메인 연결, 연간 결제 |
| 8 | Top 리스크 | 무료 사용자 이탈 (공격적 업셀 시) |
| 9 | 완화/실험 | 담백하고 비공격적인 UI |
| 10 | 다음 단계 | 플랜 제한 시스템 구현 |

---

## 1. 디자인 철학

### 1.1 핵심 가치

| 가치 | 설명 | 구현 방법 |
|------|------|----------|
| 담백함 | 불필요한 장식 없이 명확하게 | 깨끗한 레이아웃, 여백 활용 |
| 비공격적 | 압박 없이 자연스럽게 | 언제든 닫을 수 있는 모달, "나중에" 옵션 |
| 신뢰감 | 투명한 가격, 명확한 정보 | 숨김 비용 없음, 취소 쉽게 |

### 1.2 참고 서비스 (무드보드)

| 서비스 | 참고할 점 | 참고하지 않을 점 |
|--------|----------|-----------------|
| Notion | 담백한 요금제 페이지, 비공격적 업셀 | - |
| Linear | 깔끔한 플랜 비교 UI | 너무 개발자 지향적 |
| Figma | 사용량 표시 UI | 복잡한 팀 기능 |

### 1.3 톤 & 메시지

**DO:**
- "더 많은 기능이 필요하신가요?"
- "무료: 프로젝트 3개"
- "나중에"

**DON'T:**
- "지금 업그레이드하세요!"
- "제한되었습니다"
- "이 기능은 유료입니다"

---

## 2. 컬러 팔레트

### 2.1 역할 기반 컬러 (기존 다크 테마 유지)

| 역할 | 컬러명 | Hex | 사용처 |
|------|------|-----|--------|
| **Primary** | Violet | `#8B5CF6` | 업그레이드 버튼, 강조 |
| **Primary Light** | Violet Light | `#A78BFA` | 호버 상태 |
| **Secondary** | Gray | `#6B7280` | 보조 버튼, 테두리 |
| **Surface** | Gray Dark | `#1F2937` | 카드, 모달 배경 |
| **Background** | Gray Darker | `#111827` | 전체 배경 |
| **Text Primary** | White | `#FFFFFF` | 주요 텍스트 |
| **Text Secondary** | Gray Light | `#9CA3AF` | 보조 텍스트 |

### 2.2 플랜별 컬러

| 플랜 | 컬러 | Hex | 용도 |
|------|------|-----|------|
| **Free** | Gray | `#6B7280` | Free 배지 |
| **Pro** | Violet | `#8B5CF6` | Pro 배지, 추천 표시 |
| **Team** | Blue | `#3B82F6` | Team 배지 |

### 2.3 피드백 컬러

| 상태 | 컬러 | Hex | 사용처 |
|------|------|-----|--------|
| **Success** | Green | `#22C55E` | 결제 성공, 업그레이드 완료 |
| **Warning** | Amber | `#F59E0B` | 제한 근접 경고 |
| **Error** | Red | `#EF4444` | 결제 실패 |
| **Info** | Blue | `#3B82F6` | 안내 메시지 |

---

## 3. 타이포그래피

### 3.1 폰트 패밀리 (기존 유지)

| 용도 | 폰트 | 대안 |
|------|------|------|
| 본문 | Pretendard | system-ui, sans-serif |
| 가격 | Pretendard | tabular-nums |

### 3.2 타입 스케일

| 이름 | 크기 | 굵기 | 용도 |
|------|------|------|------|
| Display | 36px | Bold (700) | 요금제 페이지 제목 |
| H1 | 24px | Bold (700) | 플랜명 |
| H2 | 20px | SemiBold (600) | 모달 제목 |
| Price | 32px | Bold (700) | 가격 표시 |
| Body Large | 16px | Regular (400) | 기능 설명 |
| Body | 14px | Regular (400) | 기본 본문 |
| Caption | 12px | Regular (400) | 부가 정보 |

---

## 4. 컴포넌트 명세

### 4.1 플랜 배지 (Plan Badge)

```
┌────────────┐
│  Free  ▼   │  ← 회색 배경, 흰 텍스트
└────────────┘

┌────────────┐
│  Pro   ▼   │  ← 보라색 배경, 흰 텍스트
└────────────┘

┌────────────┐
│  Team  ▼   │  ← 파란색 배경, 흰 텍스트
└────────────┘
```

**스타일:**
- 크기: 높이 28px, 패딩 8px 12px
- 모서리: 6px 라운드
- 폰트: 12px, SemiBold
- 드롭다운 화살표 포함 (클릭 시 요금제 페이지)

### 4.2 사용량 바 (Usage Bar)

```
프로젝트
████████░░  2/3

오늘 내보내기
██████░░░░  6/10

협업자
██████████  1/1  (제한 도달)
```

**스타일:**
- 바 높이: 8px
- 배경: `#374151`
- 채움: Primary 컬러 (보라)
- 제한 도달 시: Warning 컬러 (주황)
- 숫자: 우측 정렬, Caption 스타일

### 4.3 업그레이드 모달 (비공격적)

```
┌─────────────────────────────────────────────┐
│                                         [X] │
│                                             │
│   더 많은 기능이 필요하신가요?               │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │  프로젝트    ████████████  3/3      │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Pro 플랜으로 업그레이드하면               │
│   프로젝트를 무제한으로 만들 수 있어요.     │
│                                             │
│   ┌─────────────────┐  ┌─────────────────┐  │
│   │    나중에       │  │  플랜 살펴보기  │  │
│   └─────────────────┘  └─────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**원칙:**
- X 버튼 항상 표시
- "나중에" 버튼 눈에 잘 보이게
- 강요하지 않는 문구
- 배경 클릭으로 닫기 가능

### 4.4 플랜 카드 (Pricing Card)

```
┌─────────────────────────┐
│                         │
│   Free                  │
│   ₩0                    │
│   영원히 무료            │
│                         │
│   ─────────────────     │
│   ✓ 프로젝트 3개        │
│   ✓ 내보내기 일 10회    │
│   ✓ 협업자 1명          │
│   ✓ 모든 레이아웃       │
│                         │
│   [  현재 플랜  ]       │
│                         │
└─────────────────────────┘

┌─────────────────────────┐  ← 추천 플랜에 보라 테두리
│   추천                  │
│                         │
│   Pro                   │
│   ₩9,900                │
│   /월                   │
│                         │
│   ─────────────────     │
│   ✓ 프로젝트 무제한     │
│   ✓ 내보내기 무제한     │
│   ✓ 협업자 5명          │
│   ✓ 브랜딩 제거         │
│                         │
│   [ 업그레이드 ]        │  ← 보라 버튼
│                         │
└─────────────────────────┘
```

**스타일:**
- 카드 배경: Surface 컬러
- 모서리: 12px 라운드
- 추천 플랜: Primary 테두리 2px
- 추천 배지: Primary 배경, 작은 라벨

### 4.5 결제 성공 화면

```
┌─────────────────────────────────────────────┐
│                                             │
│              ✓                              │
│                                             │
│      Pro 플랜이 활성화되었습니다            │
│                                             │
│   이제 프로젝트를 무제한으로 만들 수 있어요  │
│                                             │
│         [ 계속하기 ]                        │
│                                             │
└─────────────────────────────────────────────┘
```

**스타일:**
- 체크 아이콘: Success 컬러, 64px
- 애니메이션: 체크 표시 페이드인

---

## 5. 간격 토큰 (기존 유지)

| 이름 | 값 | 용도 |
|------|-----|------|
| xs | 4px | 아이콘-텍스트 간격 |
| sm | 8px | 요소 내부 여백 |
| md | 16px | 요소 간 간격 |
| lg | 24px | 섹션 간 간격 |
| xl | 32px | 모달 내부 패딩 |
| 2xl | 48px | 페이지 여백 |

---

## 6. 접근성 체크리스트

### 6.1 필수 (MVP)

- [ ] **색상 대비**: 텍스트와 배경 대비율 4.5:1 이상
- [ ] **포커스 링**: 키보드 탐색 시 포커스 명확히 표시
- [ ] **클릭 영역**: 버튼 최소 44x44px
- [ ] **에러 표시**: 색상 + 텍스트 병행
- [ ] **가격 명확성**: 통화 기호, 기간 명시

### 6.2 권장

- [ ] 스크린 리더 호환 (가격, 플랜 정보)
- [ ] 키보드로 모달 닫기 (ESC)

---

## 7. 애니메이션

### 7.1 모달

```css
/* 모달 진입 */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal {
  animation: modal-enter 200ms ease-out;
}
```

### 7.2 사용량 바

```css
/* 바 채움 애니메이션 */
@keyframes bar-fill {
  from { width: 0; }
  to { width: var(--fill-percentage); }
}

.usage-bar-fill {
  animation: bar-fill 500ms ease-out;
}
```

### 7.3 성공 체크

```css
/* 체크 아이콘 애니메이션 */
@keyframes check-appear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-check {
  animation: check-appear 300ms ease-out;
}
```

---

## 8. Tailwind 클래스 예시

### 8.1 플랜 배지

```jsx
// Free
<span className="inline-flex items-center px-3 py-1 text-xs font-semibold
                 bg-gray-600 text-white rounded-md cursor-pointer
                 hover:bg-gray-500 transition-colors">
  Free
  <ChevronDown className="w-4 h-4 ml-1" />
</span>

// Pro
<span className="inline-flex items-center px-3 py-1 text-xs font-semibold
                 bg-violet-600 text-white rounded-md cursor-pointer
                 hover:bg-violet-500 transition-colors">
  Pro
  <ChevronDown className="w-4 h-4 ml-1" />
</span>
```

### 8.2 업그레이드 모달

```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4
                  shadow-xl animate-in fade-in zoom-in-95 duration-200">
    {/* 닫기 버튼 */}
    <button className="absolute top-4 right-4 text-gray-400 hover:text-white">
      <X className="w-5 h-5" />
    </button>

    {/* 내용 */}
    <h2 className="text-xl font-semibold text-white mb-4">
      더 많은 기능이 필요하신가요?
    </h2>

    {/* 버튼 */}
    <div className="flex gap-3 mt-6">
      <button className="flex-1 px-4 py-2 text-gray-300 hover:text-white
                         border border-gray-600 rounded-lg transition-colors">
        나중에
      </button>
      <button className="flex-1 px-4 py-2 bg-violet-600 text-white
                         rounded-lg hover:bg-violet-500 transition-colors">
        플랜 살펴보기
      </button>
    </div>
  </div>
</div>
```

---

## Decision Log

| # | 결정 | 이유 |
|---|------|------|
| D1 | 기존 다크 테마 유지 | 일관성, 변경 최소화 |
| D2 | 보라색을 Pro 강조 컬러로 | 기존 Primary와 조화 |
| D3 | "나중에" 버튼 왼쪽 배치 | 눈에 잘 띄게 |
| D4 | 모달 배경 클릭으로 닫기 | 비공격적 UX |
| D5 | 가격에 원화 기호 명시 | 명확성 |
