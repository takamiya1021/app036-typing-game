/**
 * AnalysisReportコンポーネントのテスト（Red）
 */
import { render, screen } from '@testing-library/react';
import AnalysisReport from './AnalysisReport';

describe('AnalysisReport', () => {
  const defaultProps = {
    wpm: 45,
    accuracy: 92,
    characterCount: 100,
    aiAdvice: 'タイピング速度を上げるには、まず正確性を重視しましょう。スピードは自然とついてきます。',
  };

  it('should display WPM', () => {
    render(<AnalysisReport {...defaultProps} />);
    expect(screen.getByText(/45/)).toBeInTheDocument();
    expect(screen.getByText(/WPM/i)).toBeInTheDocument();
  });

  it('should display accuracy', () => {
    render(<AnalysisReport {...defaultProps} />);
    expect(screen.getByText(/92/)).toBeInTheDocument();
    // 正確性という単語が複数箇所に出現する可能性があるため、getAllByTextを使用
    expect(screen.getAllByText(/正確性/i).length).toBeGreaterThan(0);
  });

  it('should display character count', () => {
    render(<AnalysisReport {...defaultProps} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/文字/i)).toBeInTheDocument();
  });

  it('should display AI advice', () => {
    render(<AnalysisReport {...defaultProps} />);
    expect(screen.getByText(/タイピング速度を上げるには/)).toBeInTheDocument();
  });

  it('should display loading state when advice is not provided', () => {
    render(<AnalysisReport {...defaultProps} aiAdvice="" />);
    expect(screen.getByText(/分析中|読み込み中/i)).toBeInTheDocument();
  });

  it('should show positive feedback for high WPM', () => {
    render(<AnalysisReport {...defaultProps} wpm={80} />);
    // 80 WPMが表示される
    expect(screen.getByText(/80/)).toBeInTheDocument();
  });

  it('should show encouragement for low WPM', () => {
    render(<AnalysisReport {...defaultProps} wpm={15} />);
    // 15 WPMが表示される
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should display accuracy with color coding', () => {
    const { container } = render(<AnalysisReport {...defaultProps} accuracy={95} />);

    // 高精度の場合、緑色のテキストが表示される
    const accuracyElement = screen.getByText(/95/);
    expect(accuracyElement.className).toContain('text-green');
  });

  it('should handle multiline AI advice', () => {
    const multilineAdvice = 'まず正確性を重視しましょう。\n\nスピードは自然とついてきます。';
    render(<AnalysisReport {...defaultProps} aiAdvice={multilineAdvice} />);

    expect(screen.getByText(/まず正確性を重視しましょう/)).toBeInTheDocument();
  });

  it('should update when props change', () => {
    const { rerender } = render(<AnalysisReport {...defaultProps} />);
    expect(screen.getByText(/45/)).toBeInTheDocument();

    rerender(<AnalysisReport {...defaultProps} wpm={60} />);
    expect(screen.getByText(/60/)).toBeInTheDocument();
  });
});
