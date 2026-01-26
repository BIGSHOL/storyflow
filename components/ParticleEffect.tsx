import React, { memo, useMemo } from 'react';
import type { ParticleSettings, ParticleEffectType } from '../types';

interface ParticleEffectProps {
  settings: ParticleSettings;
  isGlobal?: boolean; // true면 전체 페이지에 fixed로 표시
}

interface ParticleConfig {
  className: string;
  baseCount: number;
  baseDuration: number;
  renderParticle: (index: number, style: React.CSSProperties) => React.ReactNode;
}

// 각 파티클 타입별 설정
const getParticleConfig = (type: ParticleEffectType, color?: string): ParticleConfig | null => {
  const configs: Record<Exclude<ParticleEffectType, 'none'>, ParticleConfig> = {
    petals: {
      className: 'particle-petal',
      baseCount: 8,
      baseDuration: 8,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-petal"
          style={{
            ...style,
            background: color || `radial-gradient(ellipse at 30% 30%, #ffb7c5, #ff69b4)`,
          }}
        />
      ),
    },
    stars: {
      className: 'particle-star',
      baseCount: 8,
      baseDuration: 2,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-star"
          style={{
            ...style,
            // 커스텀 색상이 있으면 그라데이션 대신 사용
            ...(color ? { background: color } : {}),
          }}
        />
      ),
    },
    hearts: {
      className: 'particle-heart',
      baseCount: 6,
      baseDuration: 10,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-heart"
          style={{
            ...style,
            background: color || '#ff6b81',
            transform: 'rotate(-45deg)',
          }}
        />
      ),
    },
    butterflies: {
      className: 'particle-butterfly',
      baseCount: 4,
      baseDuration: 12,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-butterfly"
          style={style}
        >
          <div
            className="particle-butterfly-wing left"
            style={{ background: color || undefined }}
          />
          <div
            className="particle-butterfly-wing right"
            style={{ background: color || undefined }}
          />
        </div>
      ),
    },
    sparkles: {
      className: 'particle-sparkle',
      baseCount: 20,
      baseDuration: 2,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-sparkle"
          style={{
            ...style,
            background: color || 'white',
            boxShadow: color
              ? `0 0 6px 2px ${color}`
              : '0 0 6px 2px rgba(255, 255, 255, 0.8)',
          }}
        />
      ),
    },
    snowflakes: {
      className: 'particle-snowflake',
      baseCount: 12,
      baseDuration: 10,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-snowflake"
          style={{
            ...style,
            background: color || 'white',
          }}
        />
      ),
    },
    leaves: {
      className: 'particle-leaf',
      baseCount: 6,
      baseDuration: 9,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-leaf"
          style={{
            ...style,
            background: color || `linear-gradient(135deg, #d2691e 0%, #8b4513 50%, #a0522d 100%)`,
          }}
        />
      ),
    },
    sakura: {
      className: 'particle-sakura',
      baseCount: 10,
      baseDuration: 8,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-sakura"
          style={{
            ...style,
            background: color || `radial-gradient(ellipse at 30% 30%, #fff0f5, #ffb6c1)`,
          }}
        />
      ),
    },
    bubbles: {
      className: 'particle-bubble',
      baseCount: 8,
      baseDuration: 12,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-bubble"
          style={style}
        />
      ),
    },
    embers: {
      className: 'particle-ember',
      baseCount: 15,
      baseDuration: 6,
      renderParticle: (index, style) => (
        <div
          key={index}
          className="particle particle-ember"
          style={{
            ...style,
            background: color || `radial-gradient(circle, #ff6600, #ff3300)`,
            boxShadow: color
              ? `0 0 6px 2px ${color}`
              : '0 0 6px 2px rgba(255, 100, 0, 0.6)',
          }}
        />
      ),
    },
  };

  return type === 'none' ? null : configs[type];
};

// 랜덤 값 생성 헬퍼 (seed 기반으로 일관성 유지)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const ParticleEffect: React.FC<ParticleEffectProps> = memo(({ settings, isGlobal = false }) => {
  const { enabled, type, intensity, speed, color, opacity = 0.8 } = settings;

  const particles = useMemo(() => {
    if (!enabled || type === 'none') return null;

    const config = getParticleConfig(type, color);
    if (!config) return null;

    // 파티클 개수 = 기본 개수 * 강도 배율 (최대 100개 제한)
    const count = Math.min(Math.round(config.baseCount * intensity), 100);

    // 애니메이션 기본 시간 / 속도 배율
    const duration = config.baseDuration / speed;

    const particleElements: React.ReactNode[] = [];

    for (let i = 0; i < count; i++) {
      const random1 = seededRandom(i * 1);
      const random2 = seededRandom(i * 2);
      const random3 = seededRandom(i * 3);
      const random4 = seededRandom(i * 4);

      // 파티클별 스타일
      // 파티클 타입별 시작 위치 결정
      const isFloatingType = type === 'bubbles' || type === 'hearts' || type === 'embers';
      const isSpreadType = type === 'sparkles' || type === 'butterflies';

      // 시작 위치 계산
      let topPosition: string;
      if (isFloatingType) {
        // 떠오르는 타입: 화면 하단 70%~95% 범위에서 시작
        topPosition = `${70 + random2 * 25}%`;
      } else if (isSpreadType) {
        // 퍼지는 타입: 전체 화면에 분포 (10%~90%)
        topPosition = `${10 + random2 * 80}%`;
      } else {
        // 떨어지는 타입: 화면 상단 5%~15% 범위에서 시작
        topPosition = `${5 + random2 * 10}%`;
      }

      const style: React.CSSProperties = {
        left: `${random1 * 100}%`,
        top: topPosition,
        opacity: opacity * (0.6 + random3 * 0.4),
        animationDuration: `${duration * (0.7 + random4 * 0.6)}s`,
        // 딜레이 최대값을 duration의 30%로 제한 (빠르게 시작)
        animationDelay: `${random1 * duration * 0.3}s`,
        // CSS 변수로 흔들림 정도 전달
        ['--particle-sway' as string]: `${(random2 - 0.5) * 100}px`,
        ['--particle-rotation' as string]: `${random3 * 720}deg`,
        ['--start-y' as string]: `${random2 * 80 + 10}%`,
        // 크기 변화
        transform: `scale(${0.6 + random4 * 0.8})`,
      };

      particleElements.push(config.renderParticle(i, style));
    }

    return particleElements;
  }, [enabled, type, intensity, speed, color, opacity]);

  if (!enabled || type === 'none' || !particles) {
    return null;
  }

  return (
    <div
      className={isGlobal ? 'particle-container-global' : 'particle-container'}
      aria-hidden="true"
    >
      {particles}
    </div>
  );
});

ParticleEffect.displayName = 'ParticleEffect';

export default ParticleEffect;
