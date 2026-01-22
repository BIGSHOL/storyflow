# Integration Specialist Agent

외부 서비스 연동 전문 에이전트입니다.

## 역할

StoryFlow Creator와 외부 서비스(결제, 분석, 소셜, 스토리지 등)의 연동을 설계하고 구현합니다.

## 연동 서비스

### 결제
- Stripe (해외)
- Toss Payments (국내)

### 분석
- Google Analytics 4
- Meta Pixel
- Hotjar

### 소셜 로그인
- Google (구현 완료)
- Apple (계획)
- Kakao (계획)

### 스토리지
- Supabase Storage (구현 완료)
- Cloudflare R2 (계획)

### 이메일
- Resend
- SendGrid

### AI
- OpenAI (콘텐츠 생성)
- Replicate (이미지 생성)

## 담당 파일

```
storyflow-creator/
├── services/
│   ├── integrations/
│   │   ├── stripe.ts             # Stripe 결제
│   │   ├── toss.ts               # Toss 결제
│   │   ├── googleAnalytics.ts    # GA4
│   │   ├── metaPixel.ts          # Meta Pixel
│   │   ├── resend.ts             # 이메일
│   │   ├── openai.ts             # AI 콘텐츠
│   │   └── replicate.ts          # AI 이미지
│   └── authService.ts            # 소셜 로그인
├── hooks/
│   ├── usePayment.ts             # 결제 훅
│   └── useAI.ts                  # AI 생성 훅
├── components/
│   ├── PaymentForm.tsx           # 결제 폼
│   ├── SocialLoginButtons.tsx    # 소셜 로그인 버튼
│   └── AIAssistant.tsx           # AI 어시스턴트
└── types/
    └── integrations.ts           # 연동 타입
```

## 결제 연동

### Stripe

```typescript
// services/integrations/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const stripeService = {
  // 구독 체크아웃 세션 생성
  async createCheckoutSession(priceId: string, userId: string) {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  },

  // 결제 페이지로 리다이렉트
  async redirectToCheckout(sessionId: string) {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  },

  // 포털 세션 (구독 관리)
  async createPortalSession(customerId: string) {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    const { url } = await response.json();
    window.location.href = url;
  },
};

// 웹훅 처리 (서버 사이드)
// supabase/functions/stripe-webhook/index.ts
export const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await activateSubscription(session.client_reference_id!, session.subscription as string);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(subscription.id, subscription.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await cancelSubscription(subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice.subscription as string);
      break;
    }
  }
};
```

### Toss Payments

```typescript
// services/integrations/toss.ts
import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/payment-sdk';

let tossPayments: TossPaymentsInstance | null = null;

const getTossPayments = async () => {
  if (!tossPayments) {
    tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);
  }
  return tossPayments;
};

export const tossService = {
  // 카드 결제
  async requestCardPayment(orderId: string, amount: number, orderName: string) {
    const toss = await getTossPayments();

    await toss.requestPayment('카드', {
      orderId,
      amount,
      orderName,
      customerName: '고객',
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
    });
  },

  // 정기결제 (빌링키 발급)
  async requestBillingAuth(customerKey: string) {
    const toss = await getTossPayments();

    await toss.requestBillingAuth('카드', {
      customerKey,
      successUrl: `${window.location.origin}/billing/success`,
      failUrl: `${window.location.origin}/billing/fail`,
    });
  },

  // 결제 승인 (서버)
  async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    const response = await fetch('/api/toss/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    return response.json();
  },
};
```

## 분석 연동

### Google Analytics 4

```typescript
// services/integrations/googleAnalytics.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initGA = (measurementId: string) => {
  // gtag.js 로드
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
};

export const gaService = {
  // 페이지 뷰
  pageView(path: string, title: string) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  },

  // 이벤트
  event(action: string, category: string, label?: string, value?: number) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  },

  // 전환 추적
  conversion(conversionId: string, value?: number) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value,
      currency: 'KRW',
    });
  },

  // 사용자 속성
  setUserProperties(properties: Record<string, any>) {
    window.gtag('set', 'user_properties', properties);
  },
};
```

### Meta Pixel

```typescript
// services/integrations/metaPixel.ts

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const initMetaPixel = (pixelId: string) => {
  // Pixel 코드 삽입
  (function(f: any, b: any, e: any, v: string, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

export const metaPixelService = {
  pageView() {
    window.fbq('track', 'PageView');
  },

  lead() {
    window.fbq('track', 'Lead');
  },

  completeRegistration() {
    window.fbq('track', 'CompleteRegistration');
  },

  startTrial() {
    window.fbq('track', 'StartTrial');
  },

  subscribe(value: number) {
    window.fbq('track', 'Subscribe', { value, currency: 'KRW' });
  },

  purchase(value: number, contentId: string) {
    window.fbq('track', 'Purchase', {
      value,
      currency: 'KRW',
      content_ids: [contentId],
    });
  },
};
```

## 이메일 연동

### Resend

```typescript
// services/integrations/resend.ts (Edge Function)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  // 협업자 초대 이메일
  async sendInvitation(to: string, inviterName: string, projectTitle: string, inviteUrl: string) {
    await resend.emails.send({
      from: 'StoryFlow <noreply@storyflow.app>',
      to,
      subject: `${inviterName}님이 프로젝트에 초대했어요`,
      html: `
        <h1>${inviterName}님이 "${projectTitle}" 프로젝트에 초대했어요</h1>
        <p>아래 버튼을 클릭하여 초대를 수락하세요.</p>
        <a href="${inviteUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        ">초대 수락하기</a>
      `,
    });
  },

  // 구독 환영 이메일
  async sendWelcomeEmail(to: string, tierName: string) {
    await resend.emails.send({
      from: 'StoryFlow <noreply@storyflow.app>',
      to,
      subject: `StoryFlow ${tierName} 구독을 환영합니다!`,
      html: `
        <h1>${tierName} 구독을 시작하셨어요!</h1>
        <p>이제 더 많은 기능을 사용할 수 있어요.</p>
        <ul>
          <li>프로젝트 무제한 생성</li>
          <li>프리미엄 템플릿 사용</li>
          <li>PDF/PNG 내보내기</li>
        </ul>
        <a href="https://storyflow.app">시작하기</a>
      `,
    });
  },

  // 결제 실패 알림
  async sendPaymentFailedEmail(to: string) {
    await resend.emails.send({
      from: 'StoryFlow <billing@storyflow.app>',
      to,
      subject: '결제에 문제가 발생했어요',
      html: `
        <h1>결제 처리에 실패했어요</h1>
        <p>카드 정보를 확인하고 다시 시도해주세요.</p>
        <a href="https://storyflow.app/billing">결제 정보 업데이트</a>
      `,
    });
  },
};
```

## AI 연동

### OpenAI (콘텐츠 생성)

```typescript
// services/integrations/openai.ts (Edge Function)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  // 섹션 설명 자동 생성
  async generateDescription(title: string, context?: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 웹페이지 카피라이터입니다. 간결하고 매력적인 설명을 작성하세요. 한국어로 답변하세요.',
        },
        {
          role: 'user',
          content: `제목: "${title}"${context ? `\n맥락: ${context}` : ''}\n\n이 섹션에 적합한 설명을 50자 내외로 작성해주세요.`,
        },
      ],
      max_tokens: 200,
    });

    return completion.choices[0].message.content;
  },

  // 전체 페이지 콘텐츠 제안
  async suggestPageContent(topic: string, sectionCount: number = 5) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 웹페이지 기획자입니다. 스토리텔링 형식의 랜딩 페이지 구성을 제안하세요.',
        },
        {
          role: 'user',
          content: `주제: "${topic}"\n${sectionCount}개 섹션으로 구성된 페이지를 제안해주세요. 각 섹션마다 제목과 설명, 적합한 레이아웃을 JSON 형식으로 답변하세요.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  },
};
```

### Replicate (이미지 생성)

```typescript
// services/integrations/replicate.ts (Edge Function)
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const imageAIService = {
  // 배경 이미지 생성
  async generateBackgroundImage(prompt: string, style: 'photo' | 'illustration' = 'photo') {
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: `${prompt}, ${style === 'photo' ? 'professional photography' : 'digital illustration'}, high quality, 4k`,
          negative_prompt: 'text, watermark, logo, blurry, low quality',
          width: 1920,
          height: 1080,
        },
      }
    );

    return output[0]; // 이미지 URL
  },

  // 이미지 업스케일
  async upscaleImage(imageUrl: string) {
    const output = await replicate.run(
      'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
      {
        input: {
          image: imageUrl,
          scale: 2,
        },
      }
    );

    return output;
  },

  // 배경 제거
  async removeBackground(imageUrl: string) {
    const output = await replicate.run(
      'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
      {
        input: {
          image: imageUrl,
        },
      }
    );

    return output;
  },
};
```

## 소셜 로그인

### Kakao 로그인

```typescript
// services/authService.ts (Kakao 추가)
export const authService = {
  // ... 기존 Google 로그인

  async signInWithKakao() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },
};
```

## 환경 변수

```env
# .env.local
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Toss Payments
VITE_TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXX

# Meta Pixel
VITE_META_PIXEL_ID=xxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Replicate
REPLICATE_API_TOKEN=r8_xxx
```

## 작업 지침

### 새 연동 추가 시
1. 서비스 타입 정의
2. 서비스 파일 생성
3. 환경 변수 추가
4. 필요시 웹훅 구현
5. 에러 처리 추가

### 보안 고려사항
- API 키는 서버에서만 사용
- 웹훅 서명 검증
- Rate limiting 적용

## 체크리스트

- [ ] API 키가 안전하게 관리되는가?
- [ ] 웹훅 서명이 검증되는가?
- [ ] 에러 처리가 적절한가?
- [ ] 테스트 환경과 프로덕션이 분리되었는가?
- [ ] 사용량 제한이 적용되었는가?
