# SEO & Publishing Specialist Agent

SEO 최적화 및 배포 전문 에이전트입니다.

## 역할

StoryFlow Creator로 생성된 페이지의 SEO 최적화, 메타 태그 관리, 다양한 배포 옵션을 설계하고 구현합니다.

## SEO 기능

### 메타 태그 관리
- 제목 (title)
- 설명 (description)
- 키워드 (keywords)
- 작성자 (author)
- 캐노니컬 URL

### 오픈 그래프 (OG)
- og:title
- og:description
- og:image
- og:url
- og:type

### Twitter Card
- twitter:card
- twitter:title
- twitter:description
- twitter:image

### 구조화된 데이터
- JSON-LD
- Schema.org

## 담당 파일

```
storyflow-creator/
├── components/
│   ├── SEOSettings.tsx           # SEO 설정 UI
│   ├── MetaPreview.tsx           # 미리보기 (Google, FB, Twitter)
│   └── OGImageGenerator.tsx      # OG 이미지 생성
├── services/
│   ├── seoService.ts             # SEO 관련 유틸
│   ├── exportService.ts          # 메타 태그 포함 내보내기
│   └── publishService.ts         # 배포 서비스
├── hooks/
│   └── useSEO.ts                 # SEO 설정 훅
└── types/
    └── seo.ts                    # SEO 타입
```

## 데이터 모델

### SEO 설정 타입
```typescript
// types/seo.ts

interface SEOSettings {
  // 기본 메타
  title: string;
  description: string;
  keywords: string[];
  author: string;
  canonicalUrl?: string;
  language: string;

  // 오픈 그래프
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: 'website' | 'article';

  // Twitter
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // 추가 설정
  noIndex: boolean;
  noFollow: boolean;

  // 구조화된 데이터
  structuredData?: StructuredData;
}

interface StructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebPage' | 'Article' | 'Organization';
  name: string;
  description: string;
  url?: string;
  image?: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
}

interface PublishSettings {
  subdomain?: string;        // storyflow.app/[subdomain]
  customDomain?: string;     // Pro+ 기능
  favicon?: string;
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}
```

## SEO 설정 컴포넌트

```tsx
// components/SEOSettings.tsx
interface SEOSettingsProps {
  settings: SEOSettings;
  onUpdate: (settings: Partial<SEOSettings>) => void;
}

export const SEOSettings: React.FC<SEOSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* 기본 메타 */}
      <section>
        <h3 className="text-lg font-bold mb-3">기본 정보</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              페이지 제목 (60자 이내 권장)
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              maxLength={70}
              className="w-full px-3 py-2 bg-gray-700 rounded"
            />
            <div className="text-xs text-gray-500 mt-1">
              {settings.title.length}/60
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              설명 (160자 이내 권장)
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 rounded"
            />
            <div className="text-xs text-gray-500 mt-1">
              {settings.description.length}/160
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">키워드</label>
            <input
              type="text"
              value={settings.keywords.join(', ')}
              onChange={(e) => onUpdate({
                keywords: e.target.value.split(',').map(k => k.trim())
              })}
              placeholder="키워드1, 키워드2, 키워드3"
              className="w-full px-3 py-2 bg-gray-700 rounded"
            />
          </div>
        </div>
      </section>

      {/* 오픈 그래프 */}
      <section>
        <h3 className="text-lg font-bold mb-3">소셜 미디어 미리보기</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">OG 이미지</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.ogImage || ''}
                onChange={(e) => onUpdate({ ogImage: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-gray-700 rounded"
              />
              <button
                onClick={() => {/* OG 이미지 자동 생성 */}}
                className="px-4 py-2 bg-blue-500 rounded"
              >
                자동 생성
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              권장 크기: 1200x630px
            </p>
          </div>
        </div>
      </section>

      {/* 미리보기 */}
      <MetaPreview settings={settings} />
    </div>
  );
};
```

## 메타 태그 미리보기

```tsx
// components/MetaPreview.tsx
interface MetaPreviewProps {
  settings: SEOSettings;
}

export const MetaPreview: React.FC<MetaPreviewProps> = ({ settings }) => {
  const [tab, setTab] = useState<'google' | 'facebook' | 'twitter'>('google');

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex gap-2 mb-4">
        {(['google', 'facebook', 'twitter'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            {t === 'google' ? 'Google' : t === 'facebook' ? 'Facebook' : 'Twitter'}
          </button>
        ))}
      </div>

      {tab === 'google' && (
        <div className="bg-white text-black rounded p-4">
          <div className="text-blue-700 text-lg hover:underline cursor-pointer">
            {settings.title || '페이지 제목'}
          </div>
          <div className="text-green-700 text-sm">
            https://example.com/page
          </div>
          <div className="text-gray-600 text-sm">
            {settings.description || '페이지 설명이 여기에 표시됩니다...'}
          </div>
        </div>
      )}

      {tab === 'facebook' && (
        <div className="bg-white rounded overflow-hidden">
          {settings.ogImage && (
            <img
              src={settings.ogImage}
              alt="OG Preview"
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-3 border-t">
            <div className="text-gray-500 text-xs uppercase">example.com</div>
            <div className="text-black font-bold">
              {settings.ogTitle || settings.title || '페이지 제목'}
            </div>
            <div className="text-gray-600 text-sm">
              {settings.ogDescription || settings.description || '설명'}
            </div>
          </div>
        </div>
      )}

      {tab === 'twitter' && (
        <div className="bg-white rounded-xl overflow-hidden border">
          {settings.twitterImage && (
            <img
              src={settings.twitterImage}
              alt="Twitter Preview"
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-3">
            <div className="text-black font-bold">
              {settings.twitterTitle || settings.title || '페이지 제목'}
            </div>
            <div className="text-gray-600 text-sm">
              {settings.twitterDescription || settings.description || '설명'}
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
              <Link className="w-3 h-3" />
              example.com
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## HTML 내보내기 시 SEO 적용

```typescript
// services/exportService.ts (SEO 부분)

const generateMetaTags = (seo: SEOSettings): string => {
  const tags: string[] = [];

  // 기본 메타
  tags.push(`<title>${escapeHtml(seo.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);

  if (seo.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${escapeHtml(seo.keywords.join(', '))}">`);
  }

  if (seo.author) {
    tags.push(`<meta name="author" content="${escapeHtml(seo.author)}">`);
  }

  if (seo.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}">`);
  }

  // 로봇
  const robots: string[] = [];
  if (seo.noIndex) robots.push('noindex');
  if (seo.noFollow) robots.push('nofollow');
  if (robots.length > 0) {
    tags.push(`<meta name="robots" content="${robots.join(', ')}">`);
  }

  // 오픈 그래프
  tags.push(`<meta property="og:type" content="${seo.ogType}">`);
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.ogTitle || seo.title)}">`);
  tags.push(`<meta property="og:description" content="${escapeHtml(seo.ogDescription || seo.description)}">`);

  if (seo.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(seo.ogImage)}">`);
  }

  // Twitter
  tags.push(`<meta name="twitter:card" content="${seo.twitterCard}">`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.twitterTitle || seo.title)}">`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(seo.twitterDescription || seo.description)}">`);

  if (seo.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(seo.twitterImage)}">`);
  }

  // 구조화된 데이터
  if (seo.structuredData) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>`);
  }

  return tags.join('\n    ');
};

// HTML 생성 시 적용
const generateHTML = async (sections: Section[], seo: SEOSettings) => {
  return `<!DOCTYPE html>
<html lang="${seo.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${generateMetaTags(seo)}
    <style>${CSS_STYLES}</style>
</head>
<body>
    ${sectionsHTML}
</body>
</html>`;
};
```

## OG 이미지 자동 생성

```typescript
// components/OGImageGenerator.tsx

export const generateOGImage = async (
  title: string,
  description: string,
  backgroundImage?: string
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d')!;

  // 배경
  if (backgroundImage) {
    const img = await loadImage(backgroundImage);
    ctx.drawImage(img, 0, 0, 1200, 630);
    // 오버레이
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 1200, 630);
  } else {
    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
  }

  // 제목
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, title, 600, 280, 1000, 70);

  // 설명
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '28px sans-serif';
  wrapText(ctx, description, 600, 400, 900, 40);

  // 로고
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '20px sans-serif';
  ctx.fillText('Made with StoryFlow', 600, 580);

  return canvas.toDataURL('image/png');
};
```

## 배포 옵션

### 1. HTML 다운로드 (Free)
- 단일 HTML 파일 다운로드
- 사용자가 직접 호스팅

### 2. StoryFlow 호스팅 (Pro)
- storyflow.app/username/project 형태
- SSL 인증서 포함
- CDN 배포

### 3. 커스텀 도메인 (Business)
- 사용자 도메인 연결
- DNS 설정 가이드
- SSL 자동 발급

```typescript
// services/publishService.ts

export const publishService = {
  // StoryFlow 호스팅 배포
  async publishToStoryFlow(projectId: string, subdomain: string) {
    // 서브도메인 사용 가능 여부 확인
    const { data: existing } = await supabase
      .from('published_sites')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (existing) {
      return { error: { message: '이미 사용 중인 주소예요' } };
    }

    // 배포
    const { data, error } = await supabase
      .from('published_sites')
      .upsert({
        project_id: projectId,
        subdomain,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    return {
      data: data ? { url: `https://storyflow.app/${subdomain}` } : null,
      error,
    };
  },

  // 커스텀 도메인 연결
  async connectCustomDomain(projectId: string, domain: string) {
    // DNS 확인
    const verified = await verifyDNS(domain);
    if (!verified) {
      return {
        error: {
          message: 'DNS 설정이 확인되지 않았어요. CNAME 레코드를 확인해주세요.',
        },
      };
    }

    // SSL 인증서 발급
    await requestSSLCertificate(domain);

    // 도메인 연결
    const { data, error } = await supabase
      .from('published_sites')
      .update({ custom_domain: domain })
      .eq('project_id', projectId)
      .select()
      .single();

    return { data, error };
  },
};
```

## 작업 지침

### SEO 설정 추가 시
1. SEOSettings 타입 업데이트
2. 설정 UI 추가
3. 내보내기 시 메타 태그 생성
4. 미리보기 업데이트

### 새 배포 옵션 추가 시
1. 배포 플로우 설계
2. 서비스 함수 구현
3. UI 구현
4. 티어 제한 적용

## 체크리스트

- [ ] 메타 태그가 올바르게 생성되는가?
- [ ] OG 이미지가 1200x630인가?
- [ ] 구조화된 데이터가 유효한가?
- [ ] 배포된 페이지가 접근 가능한가?
- [ ] SSL이 적용되었는가?
