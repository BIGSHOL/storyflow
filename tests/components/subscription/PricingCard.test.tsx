import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricingCard } from '../../../components/subscription/PricingCard';

describe('PricingCard', () => {
  describe('Free 플랜', () => {
    it('플랜 이름을 표시한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('가격을 "무료"로 표시한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('무료')).toBeInTheDocument();
    });

    it('"영원히 무료" 설명을 표시한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('영원히 무료')).toBeInTheDocument();
    });

    it('기능 목록을 표시한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('프로젝트 3개')).toBeInTheDocument();
      expect(screen.getByText('내보내기 일 10회')).toBeInTheDocument();
      expect(screen.getByText('협업자 1명')).toBeInTheDocument();
    });
  });

  describe('Pro 플랜', () => {
    it('가격을 표시한다', () => {
      render(<PricingCard planType="pro" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('₩9,900')).toBeInTheDocument();
      expect(screen.getByText('/월')).toBeInTheDocument();
    });

    it('기능 목록을 표시한다', () => {
      render(<PricingCard planType="pro" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('프로젝트 무제한')).toBeInTheDocument();
      expect(screen.getByText('내보내기 무제한')).toBeInTheDocument();
      expect(screen.getByText('브랜딩 제거')).toBeInTheDocument();
    });
  });

  describe('Team 플랜', () => {
    it('가격을 표시한다', () => {
      render(<PricingCard planType="team" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('₩29,900')).toBeInTheDocument();
    });

    it('팀 기능을 포함한다', () => {
      render(<PricingCard planType="team" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('팀 관리 기능')).toBeInTheDocument();
      expect(screen.getByText('협업자 무제한')).toBeInTheDocument();
    });
  });

  describe('현재 플랜', () => {
    it('"현재 플랜" 버튼을 표시한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={true} onSelect={vi.fn()} />);
      expect(screen.getByText('현재 플랜')).toBeInTheDocument();
    });

    it('버튼이 비활성화 상태이다', () => {
      render(<PricingCard planType="free" isCurrentPlan={true} onSelect={vi.fn()} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('클릭해도 onSelect를 호출하지 않는다', () => {
      const onSelect = vi.fn();
      render(<PricingCard planType="free" isCurrentPlan={true} onSelect={onSelect} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('업그레이드 가능', () => {
    it('"업그레이드" 버튼을 표시한다', () => {
      render(<PricingCard planType="pro" isCurrentPlan={false} onSelect={vi.fn()} />);
      expect(screen.getByText('업그레이드')).toBeInTheDocument();
    });

    it('클릭 시 onSelect를 호출한다', () => {
      const onSelect = vi.fn();
      render(<PricingCard planType="pro" isCurrentPlan={false} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('업그레이드'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('추천 플랜', () => {
    it('"추천" 배지를 표시한다', () => {
      render(<PricingCard planType="pro" isCurrentPlan={false} isRecommended onSelect={vi.fn()} />);
      expect(screen.getByText('추천')).toBeInTheDocument();
    });

    it('보라색 테두리를 적용한다', () => {
      render(<PricingCard planType="pro" isCurrentPlan={false} isRecommended onSelect={vi.fn()} />);
      const card = screen.getByTestId('pricing-card-pro');
      expect(card.className).toContain('border-violet-500');
    });

    it('추천이 아닌 카드는 회색 테두리를 적용한다', () => {
      render(<PricingCard planType="free" isCurrentPlan={false} onSelect={vi.fn()} />);
      const card = screen.getByTestId('pricing-card-free');
      expect(card.className).toContain('border-gray-700');
    });
  });
});
