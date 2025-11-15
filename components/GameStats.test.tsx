/**
 * GameStatsコンポーネントのテスト（Red）
 */
import { render, screen } from '@testing-library/react';
import GameStats from './GameStats';

describe('GameStats', () => {
  it('should display WPM', () => {
    render(<GameStats wpm={45} accuracy={92} characterCount={100} />);
    expect(screen.getByText(/45/)).toBeInTheDocument();
    expect(screen.getByText(/WPM/i)).toBeInTheDocument();
  });

  it('should display accuracy', () => {
    render(<GameStats wpm={45} accuracy={92} characterCount={100} />);
    expect(screen.getByText(/92/)).toBeInTheDocument();
    expect(screen.getByText(/正確性|accuracy/i)).toBeInTheDocument();
  });

  it('should display character count', () => {
    render(<GameStats wpm={45} accuracy={92} characterCount={100} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/文字/i)).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(<GameStats wpm={0} accuracy={0} characterCount={0} />);
    // 0が3箇所（WPM、正確性、文字数）に表示される
    const zeroElements = screen.getAllByText(/^0$|^0%$/);
    expect(zeroElements.length).toBeGreaterThanOrEqual(2);
  });

  it('should display 100% accuracy', () => {
    render(<GameStats wpm={60} accuracy={100} characterCount={200} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('should display high WPM values', () => {
    render(<GameStats wpm={120} accuracy={95} characterCount={500} />);
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  it('should apply correct styling for high accuracy', () => {
    const { container } = render(<GameStats wpm={60} accuracy={95} characterCount={200} />);
    // 高精度の場合、緑色のテキストが表示される
    const accuracyElement = screen.getByText(/95/);
    expect(accuracyElement.className).toContain('text-green');
  });

  it('should apply warning styling for low accuracy', () => {
    const { container } = render(<GameStats wpm={40} accuracy={60} characterCount={150} />);
    // 低精度の場合、黄色または赤色のテキストが表示される
    const accuracyElement = screen.getByText(/60/);
    expect(accuracyElement.className).toContain('text-');
  });

  it('should update when props change', () => {
    const { rerender } = render(<GameStats wpm={45} accuracy={92} characterCount={100} />);
    expect(screen.getByText(/45/)).toBeInTheDocument();

    rerender(<GameStats wpm={60} accuracy={95} characterCount={200} />);
    expect(screen.getByText(/60/)).toBeInTheDocument();
    expect(screen.getByText(/95/)).toBeInTheDocument();
  });
});
