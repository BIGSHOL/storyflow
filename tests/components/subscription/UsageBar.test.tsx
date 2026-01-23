import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageBar } from '../../../components/subscription/UsageBar';

describe('UsageBar', () => {
  it('라벨을 표시한다', () => {
    render(<UsageBar used={1} limit={3} label="프로젝트" />);
    expect(screen.getByText('프로젝트')).toBeInTheDocument();
  });

  it('사용량을 "used/limit" 형식으로 표시한다', () => {
    render(<UsageBar used={2} limit={3} label="프로젝트" />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('0/3일 때 바 너비가 0%이다', () => {
    render(<UsageBar used={0} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '0%' });
  });

  it('2/3일 때 바 너비가 약 66%이다', () => {
    render(<UsageBar used={2} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    const width = parseFloat(bar.style.width);
    expect(width).toBeCloseTo(66.67, 0);
  });

  it('3/3일 때 바 너비가 100%이다', () => {
    render(<UsageBar used={3} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('제한 도달 시 경고 색상(amber)을 적용한다', () => {
    render(<UsageBar used={3} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.className).toContain('bg-amber-500');
  });

  it('제한 미도달 시 기본 색상(violet)을 적용한다', () => {
    render(<UsageBar used={1} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.className).toContain('bg-violet-500');
  });

  it('무제한일 때 "무제한" 텍스트를 표시한다', () => {
    render(<UsageBar used={50} limit={null} label="프로젝트" />);
    expect(screen.getByText('무제한')).toBeInTheDocument();
  });

  it('무제한일 때 progressbar를 렌더링하지 않는다', () => {
    render(<UsageBar used={50} limit={null} label="프로젝트" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('초과 사용 시 100%를 넘지 않는다', () => {
    render(<UsageBar used={5} limit={3} label="프로젝트" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('접근성 속성을 포함한다', () => {
    render(<UsageBar used={2} limit={10} label="내보내기" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  });
});
