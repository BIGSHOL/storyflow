# Analytics Specialist Agent

분석 및 대시보드 전문 에이전트입니다.

## 역할

StoryFlow Creator의 사용자 행동 분석, 사용량 추적, 대시보드를 설계하고 구현합니다.

## 분석 영역

### 사용자 분석
- 일간/주간/월간 활성 사용자 (DAU/WAU/MAU)
- 신규 가입자 수
- 이탈률
- 세션 시간
- 기능별 사용률

### 프로젝트 분석
- 생성된 프로젝트 수
- 레이아웃 사용 통계
- 내보내기 통계
- 평균 섹션 수

### 비즈니스 분석
- 티어별 사용자 분포
- 전환율 (Free → Pro)
- 수익 (MRR, ARR)
- 마켓플레이스 거래량

## 담당 파일

```
storyflow-creator/
├── services/
│   └── analyticsService.ts       # 분석 서비스
├── pages/
│   └── AdminDashboard.tsx        # 관리자 대시보드
├── components/
│   ├── charts/
│   │   ├── LineChart.tsx         # 선 그래프
│   │   ├── BarChart.tsx          # 막대 그래프
│   │   ├── PieChart.tsx          # 파이 차트
│   │   └── MetricCard.tsx        # 지표 카드
│   └── dashboard/
│       ├── UserStats.tsx         # 사용자 통계
│       ├── ProjectStats.tsx      # 프로젝트 통계
│       └── RevenueStats.tsx      # 수익 통계
└── types/
    └── analytics.ts              # 분석 타입
```

## 데이터 모델

### 타입 정의
```typescript
// types/analytics.ts

interface UserMetrics {
  dau: number;
  wau: number;
  mau: number;
  newUsers: number;
  churnRate: number;
  avgSessionDuration: number; // 초
}

interface ProjectMetrics {
  totalProjects: number;
  projectsCreatedToday: number;
  avgSectionsPerProject: number;
  layoutUsage: Record<LayoutType, number>;
  exportCounts: {
    html: number;
    pdf: number;
    png: number;
  };
}

interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  tierDistribution: {
    free: number;
    pro: number;
    business: number;
  };
  conversionRate: {
    freeToPro: number;
    proToBusiness: number;
  };
  churnRate: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface DashboardData {
  users: UserMetrics;
  projects: ProjectMetrics;
  revenue: RevenueMetrics;
  userTrend: TimeSeriesData[];
  revenueTrend: TimeSeriesData[];
}
```

### 이벤트 추적
```typescript
interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

// 추적할 이벤트 타입
type EventType =
  | 'page_view'
  | 'project_created'
  | 'project_deleted'
  | 'section_added'
  | 'section_deleted'
  | 'layout_changed'
  | 'media_uploaded'
  | 'export_html'
  | 'export_pdf'
  | 'export_png'
  | 'template_applied'
  | 'template_purchased'
  | 'subscription_started'
  | 'subscription_canceled';
```

### DB 스키마
```sql
-- 분석 이벤트
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_events_type ON analytics_events(event);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_events_date ON analytics_events(created_at);

-- 일간 통계 (집계 테이블)
CREATE TABLE daily_stats (
  date DATE PRIMARY KEY,
  dau INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  projects_created INTEGER DEFAULT 0,
  exports_html INTEGER DEFAULT 0,
  exports_pdf INTEGER DEFAULT 0,
  exports_png INTEGER DEFAULT 0,
  revenue_krw INTEGER DEFAULT 0
);

-- 월간 통계
CREATE TABLE monthly_stats (
  month DATE PRIMARY KEY, -- 해당 월의 1일
  mau INTEGER DEFAULT 0,
  mrr_krw INTEGER DEFAULT 0,
  new_subscribers INTEGER DEFAULT 0,
  churned_subscribers INTEGER DEFAULT 0,
  tier_free INTEGER DEFAULT 0,
  tier_pro INTEGER DEFAULT 0,
  tier_business INTEGER DEFAULT 0
);
```

## 서비스 구현

```typescript
// services/analyticsService.ts
import { supabase } from './supabaseClient';
import { AnalyticsEvent, DashboardData, EventType } from '../types/analytics';

export const analyticsService = {
  // 이벤트 추적
  async trackEvent(event: EventType, properties: Record<string, any> = {}) {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('analytics_events').insert({
      event,
      user_id: user?.id,
      properties,
    });
  },

  // 대시보드 데이터 조회
  async getDashboardData(dateRange: { start: Date; end: Date }): Promise<DashboardData> {
    const [users, projects, revenue, userTrend, revenueTrend] = await Promise.all([
      this.getUserMetrics(dateRange),
      this.getProjectMetrics(dateRange),
      this.getRevenueMetrics(dateRange),
      this.getUserTrend(dateRange),
      this.getRevenueTrend(dateRange),
    ]);

    return { users, projects, revenue, userTrend, revenueTrend };
  },

  // 사용자 지표
  async getUserMetrics(dateRange: { start: Date; end: Date }) {
    const { data } = await supabase.rpc('get_user_metrics', {
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString(),
    });

    return data as UserMetrics;
  },

  // 프로젝트 지표
  async getProjectMetrics(dateRange: { start: Date; end: Date }) {
    const { data } = await supabase.rpc('get_project_metrics', {
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString(),
    });

    return data as ProjectMetrics;
  },

  // 수익 지표
  async getRevenueMetrics(dateRange: { start: Date; end: Date }) {
    const { data } = await supabase.rpc('get_revenue_metrics', {
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString(),
    });

    return data as RevenueMetrics;
  },

  // 사용자 추이
  async getUserTrend(dateRange: { start: Date; end: Date }) {
    const { data } = await supabase
      .from('daily_stats')
      .select('date, dau')
      .gte('date', dateRange.start.toISOString())
      .lte('date', dateRange.end.toISOString())
      .order('date');

    return data?.map(d => ({ date: d.date, value: d.dau })) || [];
  },

  // 수익 추이
  async getRevenueTrend(dateRange: { start: Date; end: Date }) {
    const { data } = await supabase
      .from('monthly_stats')
      .select('month, mrr_krw')
      .gte('month', dateRange.start.toISOString())
      .lte('month', dateRange.end.toISOString())
      .order('month');

    return data?.map(d => ({ date: d.month, value: d.mrr_krw })) || [];
  },

  // 레이아웃 사용 통계
  async getLayoutUsage() {
    const { data } = await supabase.rpc('get_layout_usage');
    return data as Record<LayoutType, number>;
  },

  // 코호트 분석
  async getCohortAnalysis(months: number = 6) {
    const { data } = await supabase.rpc('get_cohort_analysis', { months });
    return data;
  },
};
```

## 이벤트 추적 훅

```typescript
// hooks/useAnalytics.ts
import { useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { EventType } from '../types/analytics';

export const useAnalytics = () => {
  const track = useCallback((event: EventType, properties?: Record<string, any>) => {
    // 비동기로 추적 (UI 블로킹 방지)
    analyticsService.trackEvent(event, properties).catch(console.error);
  }, []);

  return { track };
};

// 사용 예시
const Editor: React.FC = () => {
  const { track } = useAnalytics();

  const handleAddSection = (layout: LayoutType) => {
    track('section_added', { layout });
    // ... 섹션 추가 로직
  };

  const handleExport = async (format: 'html' | 'pdf' | 'png') => {
    track(`export_${format}`);
    // ... 내보내기 로직
  };
};
```

## 대시보드 컴포넌트

### MetricCard
```tsx
// components/charts/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number; // 전기 대비 변화율 (%)
  icon: React.ReactNode;
  format?: 'number' | 'currency' | 'percent';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  format = 'number',
}) => {
  const formatValue = () => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return `₩${value.toLocaleString()}`;
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">{title}</span>
        <div className="p-2 bg-gray-700 rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold">{formatValue()}</div>
      {change !== undefined && (
        <div className={`text-sm mt-2 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% 전월 대비
        </div>
      )}
    </div>
  );
};
```

### AdminDashboard
```tsx
// pages/AdminDashboard.tsx
export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  useEffect(() => {
    analyticsService.getDashboardData(dateRange).then(setData);
  }, [dateRange]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">관리자 대시보드</h1>

      {/* 주요 지표 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="월간 활성 사용자"
          value={data.users.mau}
          icon={<Users />}
        />
        <MetricCard
          title="신규 가입자"
          value={data.users.newUsers}
          icon={<UserPlus />}
        />
        <MetricCard
          title="총 프로젝트"
          value={data.projects.totalProjects}
          icon={<FolderOpen />}
        />
        <MetricCard
          title="월간 반복 수익"
          value={data.revenue.mrr}
          format="currency"
          icon={<DollarSign />}
        />
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">사용자 추이</h2>
          <LineChart data={data.userTrend} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">수익 추이</h2>
          <LineChart data={data.revenueTrend} />
        </div>
      </div>

      {/* 티어 분포 */}
      <div className="bg-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-bold mb-4">티어별 분포</h2>
        <PieChart data={[
          { name: 'Free', value: data.revenue.tierDistribution.free },
          { name: 'Pro', value: data.revenue.tierDistribution.pro },
          { name: 'Business', value: data.revenue.tierDistribution.business },
        ]} />
      </div>
    </div>
  );
};
```

## 외부 분석 도구 연동

### Google Analytics 4
```typescript
// 이벤트 전송
gtag('event', 'section_added', {
  layout: 'hero',
  project_id: 'xxx',
});
```

### Mixpanel
```typescript
mixpanel.track('Export', {
  format: 'pdf',
  sections_count: 5,
});
```

### Amplitude
```typescript
amplitude.track('Template Applied', {
  template_id: 'startup-landing',
  category: 'business',
});
```

## 작업 지침

### 새 이벤트 추가 시
1. EventType에 이벤트 타입 추가
2. 추적 코드 삽입
3. 대시보드 표시 (필요시)

### 새 지표 추가 시
1. 타입 정의 추가
2. DB 함수/쿼리 작성
3. 서비스 함수 추가
4. 대시보드 컴포넌트 추가

## 체크리스트

- [ ] 이벤트가 정확히 추적되는가?
- [ ] 대시보드 로딩이 빠른가?
- [ ] 데이터 정합성이 보장되는가?
- [ ] 개인정보가 보호되는가?
- [ ] 실시간 업데이트가 필요한가?
