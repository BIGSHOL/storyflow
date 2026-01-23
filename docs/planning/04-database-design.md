# Database Design (데이터베이스 설계)

> StoryFlow Creator 수익화 기능 - 데이터 모델

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
| 8 | Top 리스크 | 무료 사용자 이탈 |
| 9 | 완화/실험 | Notion 스타일의 관대한 무료 플랜 유지 |
| 10 | 다음 단계 | 플랜 제한 시스템 구현 |

---

## 1. ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    %% 기존 테이블 (Supabase Auth)
    AUTH_USERS {
        uuid id PK "Supabase Auth 사용자 ID"
        string email UK
        timestamp created_at
    }

    %% 기존 테이블 (StoryFlow)
    PROFILES {
        uuid id PK "= auth.users.id"
        string email
        string display_name
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    PROJECTS {
        uuid id PK
        uuid user_id FK "소유자"
        string title
        jsonb sections
        jsonb settings
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }

    COLLABORATORS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string role "view/edit"
        timestamp created_at
    }

    %% 새로 추가할 테이블 (수익화)
    SUBSCRIPTIONS {
        uuid id PK "고유 식별자"
        uuid user_id FK UK "사용자 (1:1)"
        string plan_type "free/pro/team"
        string status "active/canceled/past_due"
        string billing_key "토스 빌링키 (암호화)"
        string customer_key "토스 고객 키"
        timestamp current_period_start "현재 결제 주기 시작"
        timestamp current_period_end "현재 결제 주기 종료"
        timestamp canceled_at "취소 요청일"
        timestamp created_at
        timestamp updated_at
    }

    PAYMENT_HISTORY {
        uuid id PK
        uuid subscription_id FK
        uuid user_id FK
        string payment_key "토스 결제 키"
        string order_id "주문 ID"
        integer amount "결제 금액 (원)"
        string status "succeeded/failed/refunded"
        string failure_reason "실패 사유"
        timestamp paid_at "결제 완료 시각"
        timestamp created_at
    }

    USAGE_LOGS {
        uuid id PK
        uuid user_id FK
        string action_type "export/create_project/invite"
        date action_date "KST 기준 날짜"
        integer count "해당 날짜 카운트"
        timestamp created_at
        timestamp updated_at
    }

    %% 관계 정의
    AUTH_USERS ||--|| PROFILES : "extends"
    AUTH_USERS ||--o| SUBSCRIPTIONS : "has"
    AUTH_USERS ||--o{ PROJECTS : "owns"
    AUTH_USERS ||--o{ PAYMENT_HISTORY : "has"
    AUTH_USERS ||--o{ USAGE_LOGS : "has"
    SUBSCRIPTIONS ||--o{ PAYMENT_HISTORY : "has"
    PROJECTS ||--o{ COLLABORATORS : "has"
```

---

## 2. 엔티티 상세 정의

### 2.1 SUBSCRIPTIONS (구독) - FEAT-1/2

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 고유 식별자 |
| user_id | UUID | FK → auth.users.id, UNIQUE | 사용자 (1:1) |
| plan_type | VARCHAR(20) | NOT NULL, DEFAULT 'free' | 플랜 타입 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | 구독 상태 |
| billing_key | TEXT | NULL | 토스 빌링키 (암호화 저장) |
| customer_key | VARCHAR(100) | NULL | 토스 고객 키 |
| current_period_start | TIMESTAMPTZ | NULL | 현재 결제 주기 시작 |
| current_period_end | TIMESTAMPTZ | NULL | 현재 결제 주기 종료 |
| canceled_at | TIMESTAMPTZ | NULL | 취소 요청 시각 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정일 |

**plan_type 값:**
- `free`: 무료 플랜
- `pro`: Pro 플랜 (월 9,900원)
- `team`: Team 플랜 (월 29,900원)

**status 값:**
- `active`: 활성 구독
- `canceled`: 취소됨 (current_period_end까지 유효)
- `past_due`: 결제 실패
- `expired`: 만료됨

**인덱스:**
```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);
```

### 2.2 PAYMENT_HISTORY (결제 내역) - FEAT-2

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 고유 식별자 |
| subscription_id | UUID | FK → subscriptions.id | 구독 ID |
| user_id | UUID | FK → auth.users.id | 사용자 ID |
| payment_key | VARCHAR(200) | UNIQUE | 토스 결제 키 |
| order_id | VARCHAR(100) | UNIQUE | 주문 ID |
| amount | INTEGER | NOT NULL | 결제 금액 (원) |
| status | VARCHAR(20) | NOT NULL | 결제 상태 |
| failure_reason | TEXT | NULL | 실패 사유 |
| paid_at | TIMESTAMPTZ | NULL | 결제 완료 시각 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성일 |

**status 값:**
- `pending`: 결제 대기
- `succeeded`: 결제 성공
- `failed`: 결제 실패
- `refunded`: 환불 완료

**인덱스:**
```sql
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_subscription_id ON payment_history(subscription_id);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at DESC);
```

### 2.3 USAGE_LOGS (사용량 로그) - FEAT-1

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 고유 식별자 |
| user_id | UUID | FK → auth.users.id | 사용자 ID |
| action_type | VARCHAR(50) | NOT NULL | 액션 타입 |
| action_date | DATE | NOT NULL | KST 기준 날짜 |
| count | INTEGER | NOT NULL, DEFAULT 1 | 카운트 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정일 |

**action_type 값:**
- `export`: 내보내기
- `create_project`: 프로젝트 생성
- `invite_collaborator`: 협업자 초대

**유니크 제약:**
```sql
CREATE UNIQUE INDEX idx_usage_logs_unique
ON usage_logs(user_id, action_type, action_date);
```

**인덱스:**
```sql
CREATE INDEX idx_usage_logs_user_action_date
ON usage_logs(user_id, action_type, action_date DESC);
```

---

## 3. RLS (Row Level Security) 정책

### 3.1 SUBSCRIPTIONS RLS

```sql
-- 사용자는 자신의 구독만 조회
CREATE POLICY "Users can view own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- 구독 생성/수정은 Edge Function에서만 (service_role)
CREATE POLICY "Service role can manage subscriptions"
ON subscriptions FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
```

### 3.2 PAYMENT_HISTORY RLS

```sql
-- 사용자는 자신의 결제 내역만 조회
CREATE POLICY "Users can view own payments"
ON payment_history FOR SELECT
USING (auth.uid() = user_id);

-- 결제 내역 생성은 Edge Function에서만
CREATE POLICY "Service role can insert payments"
ON payment_history FOR INSERT
USING (auth.jwt() ->> 'role' = 'service_role');
```

### 3.3 USAGE_LOGS RLS

```sql
-- 사용자는 자신의 사용량만 조회
CREATE POLICY "Users can view own usage"
ON usage_logs FOR SELECT
USING (auth.uid() = user_id);

-- 사용량 증가는 사용자가 직접 가능
CREATE POLICY "Users can update own usage"
ON usage_logs FOR ALL
USING (auth.uid() = user_id);
```

---

## 4. 트리거 및 함수

### 4.1 신규 사용자 Free 플랜 자동 생성

```sql
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_subscription();
```

### 4.2 구독 상태 업데이트 시 updated_at 갱신

```sql
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscription_timestamp();
```

### 4.3 일일 사용량 증가 함수

```sql
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_action_type VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
  v_date DATE := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;
  v_count INTEGER;
BEGIN
  INSERT INTO usage_logs (user_id, action_type, action_date, count)
  VALUES (p_user_id, p_action_type, v_date, 1)
  ON CONFLICT (user_id, action_type, action_date)
  DO UPDATE SET
    count = usage_logs.count + 1,
    updated_at = NOW()
  RETURNING count INTO v_count;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.4 사용량 조회 함수

```sql
CREATE OR REPLACE FUNCTION get_today_usage(
  p_user_id UUID,
  p_action_type VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
  v_date DATE := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;
  v_count INTEGER;
BEGIN
  SELECT count INTO v_count
  FROM usage_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND action_date = v_date;

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. 마이그레이션 쿼리

### 5.1 테이블 생성

```sql
-- 1. subscriptions 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'free',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  billing_key TEXT,
  customer_key VARCHAR(100),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_plan_type CHECK (plan_type IN ('free', 'pro', 'team')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'canceled', 'past_due', 'expired'))
);

-- 2. payment_history 테이블
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_key VARCHAR(200) UNIQUE,
  order_id VARCHAR(100) UNIQUE,
  amount INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  failure_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded'))
);

-- 3. usage_logs 테이블
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_action_type CHECK (action_type IN ('export', 'create_project', 'invite_collaborator'))
);

-- 4. 인덱스 생성
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_subscription_id ON payment_history(subscription_id);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at DESC);
CREATE UNIQUE INDEX idx_usage_logs_unique ON usage_logs(user_id, action_type, action_date);
CREATE INDEX idx_usage_logs_user_action_date ON usage_logs(user_id, action_type, action_date DESC);

-- 5. RLS 활성화
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
```

### 5.2 기존 사용자 Free 플랜 배정

```sql
-- 기존 사용자에게 Free 플랜 배정 (한 번만 실행)
INSERT INTO subscriptions (user_id, plan_type, status)
SELECT id, 'free', 'active'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;
```

---

## 6. 데이터 생명주기

| 엔티티 | 생성 시점 | 보존 기간 | 삭제/익명화 |
|--------|----------|----------|------------|
| SUBSCRIPTIONS | 회원가입 시 | 계정 삭제 시 | Cascade delete |
| PAYMENT_HISTORY | 결제 발생 시 | 5년 (법적 의무) | 보관 |
| USAGE_LOGS | 액션 발생 시 | 90일 | Hard delete |

---

## 7. 쿼리 예시

### 7.1 사용자 구독 정보 + 사용량 조회

```sql
SELECT
  s.plan_type,
  s.status,
  s.current_period_end,
  (SELECT COUNT(*) FROM projects WHERE user_id = s.user_id) as project_count,
  COALESCE(
    (SELECT count FROM usage_logs
     WHERE user_id = s.user_id
       AND action_type = 'export'
       AND action_date = (NOW() AT TIME ZONE 'Asia/Seoul')::DATE),
    0
  ) as today_export_count,
  (SELECT COUNT(*) FROM collaborators c
   JOIN projects p ON c.project_id = p.id
   WHERE p.user_id = s.user_id) as collaborator_count
FROM subscriptions s
WHERE s.user_id = :user_id;
```

### 7.2 만료 예정 구독 조회 (정기 결제용)

```sql
SELECT
  s.id,
  s.user_id,
  s.billing_key,
  s.plan_type
FROM subscriptions s
WHERE s.status = 'active'
  AND s.plan_type != 'free'
  AND s.current_period_end <= NOW() + INTERVAL '1 day'
  AND s.canceled_at IS NULL;
```

---

## Decision Log

| # | 결정 | 이유 |
|---|------|------|
| D1 | user_id에 UNIQUE 제약 | 사용자당 하나의 구독만 |
| D2 | billing_key 암호화 저장 | 보안 강화 |
| D3 | usage_logs 날짜별 집계 | 일일 제한 효율적 체크 |
| D4 | payment_history 5년 보관 | 법적 의무 준수 |
| D5 | KST 기준 날짜 사용 | 한국 사용자 대상 |
