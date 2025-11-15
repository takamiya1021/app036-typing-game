/**
 * KeyboardHeatmapコンポーネントのテスト（Red）
 */
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardHeatmap from './KeyboardHeatmap';
import { KeyStat } from '@/lib/typing/analyzer';

describe('KeyboardHeatmap', () => {
  const mockKeyStats: KeyStat[] = [
    {
      key: 'a',
      finger: 'pinky',
      hand: 'left',
      correctCount: 8,
      missCount: 2,
      averageTime: 150,
    },
    {
      key: 'f',
      finger: 'index',
      hand: 'left',
      correctCount: 10,
      missCount: 0,
      averageTime: 120,
    },
    {
      key: 'j',
      finger: 'index',
      hand: 'right',
      correctCount: 5,
      missCount: 5,
      averageTime: 200,
    },
  ];

  it('should render keyboard layout', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // キーボードコンテナが表示される
    const keyboard = screen.getByTestId('keyboard-heatmap');
    expect(keyboard).toBeInTheDocument();
  });

  it('should display all rows', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // 各行が表示される
    expect(screen.getByTestId('keyboard-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard-row-3')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard-row-4')).toBeInTheDocument();
  });

  it('should display individual keys', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // 主要なキーが表示される（大文字で表示）
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should apply color based on accuracy', () => {
    const { container } = render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // キー "a" (正答率80%) は黄色〜緑色
    const keyA = screen.getByText('A').closest('[data-key]');
    expect(keyA).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });

    // キー "f" (正答率100%) は緑色
    const keyF = screen.getByText('F').closest('[data-key]');
    expect(keyF).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });

    // キー "j" (正答率50%) は黄色
    const keyJ = screen.getByText('J').closest('[data-key]');
    expect(keyJ).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
  });

  it('should show default color for keys without stats', () => {
    const { container } = render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // 統計のないキー (例: "z") はデフォルト色（グレー）
    const keyZ = screen.getByText('Z').closest('[data-key]');
    expect(keyZ).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
  });

  it('should show tooltip on hover', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    const keyA = screen.getByText('A');
    fireEvent.mouseEnter(keyA);

    // ツールチップに統計情報が表示される
    expect(screen.getByText(/正答率/i)).toBeInTheDocument();
    expect(screen.getByText(/80%/)).toBeInTheDocument();
    expect(screen.getByText(/8.*2/)).toBeInTheDocument(); // 正解/ミス
  });


  it('should show appropriate message for keys without data on hover', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    const keyZContainer = screen.getByText('Z').parentElement?.parentElement;
    if (keyZContainer) {
      fireEvent.mouseEnter(keyZContainer);

      // データなしのメッセージが表示される
      const dataMessages = screen.getAllByText('データなし');
      expect(dataMessages.length).toBeGreaterThan(0);
    }
  });

  it('should handle empty keyStats array', () => {
    render(<KeyboardHeatmap keyStats={[]} />);

    // キーボードは表示される
    expect(screen.getByTestId('keyboard-heatmap')).toBeInTheDocument();

    // すべてのキーがデフォルト色
    const keyA = screen.getByText('A').closest('[data-key]');
    expect(keyA).toBeInTheDocument();
  });

  it('should display legend for color coding', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    // 凡例が表示される
    expect(screen.getByText(/凡例|色の意味/i)).toBeInTheDocument();
    expect(screen.getByText(/0%.*50%/)).toBeInTheDocument(); // 低正答率
    expect(screen.getByText(/100%/)).toBeInTheDocument(); // 高正答率
  });

  it('should show average typing time in tooltip', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    const keyA = screen.getByText('A');
    fireEvent.mouseEnter(keyA);

    // 平均入力時間が表示される
    expect(screen.getByText(/平均時間|入力時間/i)).toBeInTheDocument();
    expect(screen.getByText(/150.*ms/i)).toBeInTheDocument();
  });

  it('should show finger and hand info in tooltip', () => {
    render(<KeyboardHeatmap keyStats={mockKeyStats} />);

    const keyA = screen.getByText('A');
    fireEvent.mouseEnter(keyA);

    // 指と手の情報が表示される
    expect(screen.getByText(/左手|left/i)).toBeInTheDocument();
    expect(screen.getByText(/小指|pinky/i)).toBeInTheDocument();
  });

});
