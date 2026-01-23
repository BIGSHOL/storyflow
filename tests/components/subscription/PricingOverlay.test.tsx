import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PricingOverlay } from '../../../components/subscription/PricingOverlay';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  currentPlan: 'free' as const,
};

describe('PricingOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('isOpen=false일 때 렌더링하지 않는다', () => {
    render(<PricingOverlay {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('플랜 선택')).not.toBeInTheDocument();
  });

  it('isOpen=true일 때 3개 카드를 렌더링한다', () => {
    render(<PricingOverlay {...defaultProps} />);
    expect(screen.getByText('플랜 선택')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-free')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-pro')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-team')).toBeInTheDocument();
  });

  it('현재 플랜 카드에 "현재 플랜" 표시', () => {
    render(<PricingOverlay {...defaultProps} currentPlan="free" />);
    const freeCard = screen.getByTestId('pricing-card-free');
    expect(freeCard).toHaveTextContent('현재 플랜');
  });

  it('Pro 카드에 "추천" 배지 표시', () => {
    render(<PricingOverlay {...defaultProps} />);
    expect(screen.getByText('추천')).toBeInTheDocument();
  });

  it('X 버튼 클릭 시 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<PricingOverlay {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('pricing-overlay-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ESC 키 누르면 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<PricingOverlay {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경 클릭 시 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<PricingOverlay {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('pricing-overlay-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('내부 클릭은 onClose를 호출하지 않는다', () => {
    const onClose = vi.fn();
    render(<PricingOverlay {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('업그레이드 클릭 시 "준비 중" 안내를 표시한다', () => {
    render(<PricingOverlay {...defaultProps} currentPlan="free" />);

    // Pro 카드의 업그레이드 버튼 클릭
    const proCard = screen.getByTestId('pricing-card-pro');
    const upgradeButton = proCard.querySelector('button:not([disabled])') as HTMLElement;
    fireEvent.click(upgradeButton);

    expect(screen.getByTestId('pricing-overlay-toast')).toHaveTextContent('결제 기능을 준비 중이에요');
  });

  it('토스트 메시지가 3초 후 사라진다', () => {
    render(<PricingOverlay {...defaultProps} currentPlan="free" />);

    const proCard = screen.getByTestId('pricing-card-pro');
    const upgradeButton = proCard.querySelector('button:not([disabled])') as HTMLElement;
    fireEvent.click(upgradeButton);

    expect(screen.getByTestId('pricing-overlay-toast')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByTestId('pricing-overlay-toast')).not.toBeInTheDocument();
  });

  it('현재 플랜의 버튼은 비활성화된다', () => {
    render(<PricingOverlay {...defaultProps} currentPlan="pro" />);

    const proCard = screen.getByTestId('pricing-card-pro');
    const button = proCard.querySelector('button') as HTMLElement;
    expect(button).toBeDisabled();
  });
});
