import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradeModal } from '../../../components/subscription/UpgradeModal';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  limitType: 'project' as const,
  currentUsage: { used: 3, limit: 3 },
};

describe('UpgradeModal', () => {
  it('isOpen=false일 때 렌더링하지 않는다', () => {
    render(<UpgradeModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('더 많은 기능이 필요하신가요?')).not.toBeInTheDocument();
  });

  it('isOpen=true일 때 모달을 렌더링한다', () => {
    render(<UpgradeModal {...defaultProps} />);
    expect(screen.getByText('더 많은 기능이 필요하신가요?')).toBeInTheDocument();
  });

  it('X 버튼 클릭 시 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<UpgradeModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('upgrade-modal-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('"나중에" 버튼 클릭 시 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<UpgradeModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('upgrade-modal-later'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경 클릭 시 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<UpgradeModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('upgrade-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('모달 내부 클릭은 onClose를 호출하지 않는다', () => {
    const onClose = vi.fn();
    render(<UpgradeModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ESC 키 누르면 onClose를 호출한다', () => {
    const onClose = vi.fn();
    render(<UpgradeModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('프로젝트 제한 도달 시 적절한 메시지를 표시한다', () => {
    render(<UpgradeModal {...defaultProps} limitType="project" />);
    expect(screen.getByText(/프로젝트를 무제한으로/)).toBeInTheDocument();
  });

  it('내보내기 제한 도달 시 적절한 메시지를 표시한다', () => {
    render(<UpgradeModal {...defaultProps} limitType="export" />);
    expect(screen.getByText(/내보내기를 무제한으로/)).toBeInTheDocument();
  });

  it('협업자 제한 도달 시 적절한 메시지를 표시한다', () => {
    render(<UpgradeModal {...defaultProps} limitType="collaborator" />);
    expect(screen.getByText(/더 많은 팀원을 초대/)).toBeInTheDocument();
  });

  it('사용량 바를 표시한다', () => {
    render(<UpgradeModal {...defaultProps} currentUsage={{ used: 3, limit: 3 }} />);
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('"나중에" 버튼이 항상 표시된다', () => {
    render(<UpgradeModal {...defaultProps} />);
    expect(screen.getByText('나중에')).toBeInTheDocument();
  });

  it('"플랜 살펴보기" 버튼이 표시된다', () => {
    render(<UpgradeModal {...defaultProps} />);
    expect(screen.getByText('플랜 살펴보기')).toBeInTheDocument();
  });

  it('"플랜 살펴보기" 클릭 시 onViewPlans를 호출한다', () => {
    const onViewPlans = vi.fn();
    render(<UpgradeModal {...defaultProps} onViewPlans={onViewPlans} />);

    fireEvent.click(screen.getByTestId('upgrade-modal-upgrade'));
    expect(onViewPlans).toHaveBeenCalledTimes(1);
  });
});
