/**
 * 練習画面の統合テスト
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PracticePage from './page';

// AI生成のモック
jest.mock('@/app/actions/ai', () => ({
  generateTypingText: jest.fn().mockResolvedValue('これはテスト用の文章です'),
}));

describe('PracticePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should render all main components', async () => {
    render(<PracticePage />);

    await waitFor(() => {
      // 難易度選択が表示される
      expect(screen.getByText(/初級/)).toBeInTheDocument();
      expect(screen.getByText(/中級/)).toBeInTheDocument();
      expect(screen.getByText(/上級/)).toBeInTheDocument();
    });
  });

  it('should display typing area after loading', async () => {
    render(<PracticePage />);

    // ローディング中
    expect(screen.getByText(/生成中/)).toBeInTheDocument();

    // ローディング完了後、入力フィールドが表示される
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('should show stats with initial values', async () => {
    render(<PracticePage />);

    await waitFor(() => {
      // WPM, 正確性, 文字数が表示される
      expect(screen.getByText(/WPM/i)).toBeInTheDocument();
      expect(screen.getByText(/正確性/i)).toBeInTheDocument();
      expect(screen.getByText(/文字/i)).toBeInTheDocument();
    });
  });

  it('should start timer when user starts typing', async () => {
    render(<PracticePage />);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // 初期状態でタイマーが表示されている
    expect(screen.getByText(/01:00/)).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'こ' } });

    // タイマーが表示されている
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('should update character count when typing', async () => {
    render(<PracticePage />);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'これは' } });

    // 文字数が更新される（3文字）
    await waitFor(() => {
      const allText = screen.getAllByText('3');
      expect(allText.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should allow changing difficulty', async () => {
    const { generateTypingText } = require('@/app/actions/ai');
    render(<PracticePage />);

    await waitFor(() => {
      expect(screen.getByText(/初級/)).toBeInTheDocument();
    });

    const intermediateButton = screen.getByText(/中級/);
    fireEvent.click(intermediateButton);

    // AI生成が再度呼ばれる
    await waitFor(() => {
      expect(generateTypingText).toHaveBeenCalledWith('intermediate', 'sentence');
    });
  });

  it('should show loading state initially', async () => {
    render(<PracticePage />);

    // ローディング状態を確認
    expect(screen.getByText(/生成中/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('should show completion button after typing complete text', async () => {
    render(<PracticePage />);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'これはテスト用の文章です' } });

    // 完了後、リセットボタンが表示される
    await waitFor(
      () => {
        expect(screen.getByText(/もう一度挑戦/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
