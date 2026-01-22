# Marketplace Specialist Agent

템플릿 마켓플레이스 설계 및 구현 전문 에이전트입니다.

## 역할

StoryFlow Creator의 커뮤니티 템플릿 공유 마켓플레이스를 설계하고 구현합니다.

## 마켓플레이스 기능

### 핵심 기능
- 템플릿 검색 및 탐색
- 카테고리별 분류
- 인기/최신 정렬
- 템플릿 미리보기
- 원클릭 적용
- 평점 및 리뷰

### 크리에이터 기능 (Pro/Business)
- 템플릿 업로드
- 판매 템플릿 설정
- 수익 확인 대시보드
- 다운로드 통계

## 담당 파일

```
storyflow-creator/
├── services/
│   └── marketplaceService.ts     # 마켓플레이스 API
├── pages/
│   ├── MarketplacePage.tsx       # 마켓플레이스 메인
│   ├── TemplateDetailPage.tsx    # 템플릿 상세
│   └── CreatorDashboard.tsx      # 크리에이터 대시보드
├── components/
│   ├── TemplateCard.tsx          # 템플릿 카드
│   ├── TemplatePreview.tsx       # 템플릿 미리보기
│   ├── CategoryFilter.tsx        # 카테고리 필터
│   └── ReviewList.tsx            # 리뷰 목록
└── types/
    └── marketplace.ts            # 마켓플레이스 타입
```

## 데이터 모델

### 타입 정의
```typescript
// types/marketplace.ts

interface MarketplaceTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  category: TemplateCategory;
  tags: string[];
  sections: Section[];

  // 크리에이터 정보
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;

  // 가격 (0 = 무료)
  price: number;
  currency: 'KRW' | 'USD';

  // 통계
  downloads: number;
  rating: number;
  reviewCount: number;

  // 티어 제한
  requiredTier: 'free' | 'pro' | 'business';

  // 메타
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
  isFeatured: boolean;
}

type TemplateCategory =
  | 'business'
  | 'creative'
  | 'event'
  | 'personal'
  | 'education'
  | 'restaurant'
  | 'travel'
  | 'tech';

interface TemplateReview {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

interface CreatorStats {
  totalDownloads: number;
  totalRevenue: number;
  templateCount: number;
  averageRating: number;
  monthlyDownloads: number[];
  monthlyRevenue: number[];
}
```

### DB 스키마
```sql
-- 마켓플레이스 템플릿
CREATE TABLE marketplace_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sections JSONB NOT NULL,
  price INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'KRW',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  required_tier TEXT DEFAULT 'free',
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_templates_category ON marketplace_templates(category);
CREATE INDEX idx_templates_creator ON marketplace_templates(creator_id);
CREATE INDEX idx_templates_downloads ON marketplace_templates(downloads DESC);
CREATE INDEX idx_templates_rating ON marketplace_templates(rating DESC);

-- 리뷰
CREATE TABLE template_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES marketplace_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

-- 다운로드 기록
CREATE TABLE template_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES marketplace_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE marketplace_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved templates" ON marketplace_templates
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Creators can manage own templates" ON marketplace_templates
  FOR ALL USING (auth.uid() = creator_id);
```

## 서비스 구현

```typescript
// services/marketplaceService.ts
import { supabase } from './supabaseClient';
import { MarketplaceTemplate, TemplateCategory, TemplateReview } from '../types/marketplace';

export const marketplaceService = {
  // 템플릿 목록 조회
  async getTemplates(options: {
    category?: TemplateCategory;
    search?: string;
    sortBy?: 'popular' | 'latest' | 'rating';
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('marketplace_templates')
      .select('*')
      .eq('is_approved', true);

    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    switch (options.sortBy) {
      case 'popular':
        query = query.order('downloads', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // 템플릿 상세 조회
  async getTemplate(templateId: string) {
    const { data, error } = await supabase
      .from('marketplace_templates')
      .select(`
        *,
        creator:profiles(display_name, avatar_url)
      `)
      .eq('id', templateId)
      .single();

    return { data, error };
  },

  // 템플릿 다운로드 (적용)
  async downloadTemplate(templateId: string, userId: string) {
    // 다운로드 기록
    await supabase
      .from('template_downloads')
      .insert({ template_id: templateId, user_id: userId });

    // 다운로드 카운트 증가
    await supabase.rpc('increment_downloads', { template_id: templateId });

    // 템플릿 데이터 반환
    const { data } = await supabase
      .from('marketplace_templates')
      .select('sections')
      .eq('id', templateId)
      .single();

    return { sections: data?.sections };
  },

  // 템플릿 업로드
  async uploadTemplate(template: Omit<MarketplaceTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('marketplace_templates')
      .insert(template)
      .select()
      .single();

    return { data, error };
  },

  // 리뷰 작성
  async addReview(review: Omit<TemplateReview, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('template_reviews')
      .insert(review)
      .select()
      .single();

    // 평균 평점 업데이트
    if (data) {
      await supabase.rpc('update_template_rating', { template_id: review.templateId });
    }

    return { data, error };
  },

  // 리뷰 목록 조회
  async getReviews(templateId: string, limit = 10) {
    const { data, error } = await supabase
      .from('template_reviews')
      .select(`
        *,
        user:profiles(display_name, avatar_url)
      `)
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // 크리에이터 통계
  async getCreatorStats(creatorId: string) {
    const { data, error } = await supabase
      .rpc('get_creator_stats', { creator_id: creatorId });

    return { data, error };
  },

  // 추천 템플릿
  async getFeaturedTemplates(limit = 6) {
    const { data, error } = await supabase
      .from('marketplace_templates')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .limit(limit);

    return { data, error };
  },
};
```

## 컴포넌트 구현

### TemplateCard
```tsx
// components/TemplateCard.tsx
interface TemplateCardProps {
  template: MarketplaceTemplate;
  onPreview: (id: string) => void;
  onApply: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onApply,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
      {/* 썸네일 */}
      <div className="relative aspect-video">
        <img
          src={template.thumbnail}
          alt={template.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onPreview(template.id)}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            미리보기
          </button>
          <button
            onClick={() => onApply(template.id)}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            적용하기
          </button>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{template.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{template.description}</p>

        <div className="flex items-center justify-between mt-3">
          {/* 평점 */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm">{template.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({template.reviewCount})</span>
          </div>

          {/* 가격 */}
          <div>
            {template.price === 0 ? (
              <span className="text-green-400 font-bold">무료</span>
            ) : (
              <span className="font-bold">
                ₩{template.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-700 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## 수익 모델

### 수수료 구조
| 티어 | 판매 수수료 | 최소 가격 |
|------|-----------|----------|
| Pro | 30% | ₩1,000 |
| Business | 20% | ₩1,000 |

### 정산 프로세스
1. 크리에이터가 템플릿 판매
2. 구매자 결제 완료
3. 수수료 차감 후 크리에이터 잔액에 적립
4. 월 1회 정산 (최소 ₩10,000 이상)

## 검수 프로세스

### 자동 검수
1. 파일 크기 제한 확인
2. 필수 필드 검증
3. 금지어 필터링
4. 이미지 안전성 검사 (AI)

### 수동 검수
1. 콘텐츠 품질 확인
2. 저작권 검토
3. 가이드라인 준수 확인

### 검수 상태
```typescript
type ApprovalStatus =
  | 'pending'    // 검수 대기
  | 'reviewing'  // 검수 중
  | 'approved'   // 승인됨
  | 'rejected';  // 거절됨

interface ApprovalResult {
  status: ApprovalStatus;
  reason?: string;        // 거절 사유
  reviewedAt?: Date;
  reviewerId?: string;
}
```

## 작업 지침

### 새 카테고리 추가 시
1. TemplateCategory 타입 추가
2. 카테고리 아이콘/색상 매핑
3. 필터 UI 업데이트
4. DB 인덱스 확인

### 결제 연동 시
1. Stripe/Toss Payments 연동
2. 웹훅 처리 로직 구현
3. 정산 시스템 구현
4. 세금계산서 발행 연동

## 체크리스트

- [ ] 검색이 빠르게 동작하는가?
- [ ] 미리보기가 정확한가?
- [ ] 결제 플로우가 안전한가?
- [ ] 크리에이터 통계가 정확한가?
- [ ] 리뷰 시스템이 악용 방지되는가?
