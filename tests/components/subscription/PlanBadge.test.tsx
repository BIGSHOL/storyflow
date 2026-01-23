import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlanBadge } from '../../../components/subscription/PlanBadge';

describe('PlanBadge', () => {
  it('Free 플랜 배지를 렌더링한다', () => {
    render(<PlanBadge planType="free" />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('Pro 플랜 배지를 렌더링한다', () => {
    render(<PlanBadge planType="pro" />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('Team 플랜 배지를 렌더링한다', () => {
    render(<PlanBadge planType="team" />);
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('Free 배지는 회색 스타일을 적용한다', () => {
    render(<PlanBadge planType="free" />);
    const badge = screen.getByRole('button');
    expect(badge.className).toContain('bg-gray-600');
  });

  it('Pro 배지는 보라색 스타일을 적용한다', () => {
    render(<PlanBadge planType="pro" />);
    const badge = screen.getByRole('button');
    expect(badge.className).toContain('bg-violet-600');
  });

  it('Team 배지는 파란색 스타일을 적용한다', () => {
    render(<PlanBadge planType="team" />);
    const badge = screen.getByRole('button');
    expect(badge.className).toContain('bg-blue-600');
  });

  it('클릭 시 onClick을 호출한다', () => {
    const onClick = vi.fn();
    render(<PlanBadge planType="free" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('onClick이 없어도 에러 없이 렌더링된다', () => {
    render(<PlanBadge planType="pro" />);
    fireEvent.click(screen.getByRole('button'));
    // no error
  });

  it('접근성 라벨을 포함한다', () => {
    render(<PlanBadge planType="pro" />);
    expect(screen.getByLabelText('현재 플랜: Pro')).toBeInTheDocument();
  });
});
