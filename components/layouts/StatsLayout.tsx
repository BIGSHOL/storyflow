import React, { memo, useState, useEffect, useRef } from 'react';
import { Section } from '../../types';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';

interface StatsLayoutProps {
  section: Section;
}

// RegExp 호이스팅 (js-hoist-regexp)
const NUMERIC_REGEX = /[^0-9.-]/g;
const PREFIX_REGEX = /^[^0-9]*/;
const SUFFIX_REGEX = /[^0-9]*$/;

const StatsLayout: React.FC<StatsLayoutProps> = memo(({ section }) => {
  const { stats = [], statsSettings } = section;
  const columns = statsSettings?.columns || 3;
  const animateNumbers = statsSettings?.animateNumbers ?? true;

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    fontFamily: section.fontFamily || 'system-ui, -apple-system, sans-serif',
    minHeight: section.sectionHeight || '100vh',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: `${section.titleFontSize || 36}px`,
  };

  const descStyle: React.CSSProperties = {
    fontSize: `${section.descriptionFontSize || 18}px`,
  };

  // 반응형 그리드 클래스: 모바일 1열 → 태블릿 2열 → 데스크탑 사용자 설정
  const gridClasses = `grid gap-8 grid-cols-1 sm:grid-cols-2 ${
    columns >= 3 ? 'lg:grid-cols-3' : ''
  } ${columns >= 4 ? 'xl:grid-cols-4' : ''}`;

  if (stats.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <BarChart3 size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">통계 항목을 추가하세요</p>
      </section>
    );
  }

  return (
    <section className="section-preview w-full flex flex-col items-center justify-center py-16 px-8" style={containerStyle}>
      {section.title && (
        <h2 className="font-serif font-bold text-center mb-4" style={titleStyle}>{section.title}</h2>
      )}
      {section.description && (
        <p className="text-center opacity-80 mb-16 max-w-2xl" style={descStyle}>{section.description}</p>
      )}

      <div className={`max-w-5xl w-full ${gridClasses}`}>
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} animate={animateNumbers} descriptionFontSize={section.descriptionFontSize} />
        ))}
      </div>
    </section>
  );
});

interface StatCardProps {
  stat: { id: string; value: string; label: string; description?: string; icon?: string };
  animate: boolean;
  descriptionFontSize?: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, animate, descriptionFontSize }) => {
  const [displayValue, setDisplayValue] = useState(animate ? '0' : stat.value);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!animate || !isVisible) return;

    // 숫자 추출 (호이스팅된 RegExp 사용)
    const numericValue = parseFloat(stat.value.replace(NUMERIC_REGEX, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(stat.value);
      return;
    }

    const prefix = stat.value.match(PREFIX_REGEX)?.[0] || '';
    const suffix = stat.value.match(SUFFIX_REGEX)?.[0] || '';

    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericValue);

      if (step >= steps) {
        setDisplayValue(stat.value);
        clearInterval(timer);
      } else {
        const formatted = Number.isInteger(numericValue)
          ? Math.floor(current).toLocaleString()
          : current.toFixed(1);
        setDisplayValue(`${prefix}${formatted}${suffix}`);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, animate, stat.value]);

  return (
    <div ref={ref} className="text-center p-6">
      {stat.icon && (
        <span className="text-4xl mb-4 block">{stat.icon}</span>
      )}
      <div className="text-5xl md:text-6xl font-bold mb-2 tabular-nums">
        {displayValue}
      </div>
      <div className="text-xl font-medium opacity-90 mb-1">{stat.label}</div>
      {stat.description && (
        <div className="opacity-60" style={{ fontSize: `${descriptionFontSize || 14}px` }}>{stat.description}</div>
      )}
    </div>
  );
};

StatsLayout.displayName = 'StatsLayout';

export default StatsLayout;
