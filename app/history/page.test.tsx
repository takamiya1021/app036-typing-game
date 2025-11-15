/**
 * 履歴ページのテスト（Red）
 */
import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from './page';
import * as operations from '@/lib/db/operations';

// モック
jest.mock('@/lib/db/operations');

describe('HistoryPage', () => {
  const mockSessions = [
    {
      id: 'session-1',
      timestamp: Date.now() - 1000,
      mode: 'challenge' as const,
      difficulty: 'beginner' as const,
      textType: 'sentence' as const,
      targetText: 'Test 1',
      typedText: 'Test 1',
      duration: 30,
      wpm: 45,
      accuracy: 92,
      keyStats: [],
      aiAdvice: 'Good job!',
    },
    {
      id: 'session-2',
      timestamp: Date.now() - 2000,
      mode: 'completion' as const,
      difficulty: 'intermediate' as const,
      textType: 'random' as const,
      targetText: 'Test 2',
      typedText: 'Test 2',
      duration: 45,
      wpm: 60,
      accuracy: 95,
      keyStats: [],
      aiAdvice: 'Great!',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display page title', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue([]);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /タイピング履歴/i })).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    (operations.getRecentSessions as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<HistoryPage />);

    expect(screen.getByText(/読み込み中|Loading/i)).toBeInTheDocument();
  });

  it('should display session history', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue(mockSessions);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      const wpmLabels = screen.getAllByText('WPM');
      expect(wpmLabels.length).toBeGreaterThan(0);
    });
  });

  it('should display accuracy percentages', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue(mockSessions);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/92%/)).toBeInTheDocument();
      expect(screen.getByText(/95%/)).toBeInTheDocument();
    });
  });

  it('should display session timestamps', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue(mockSessions);

    render(<HistoryPage />);

    await waitFor(() => {
      // タイムスタンプが表示されることを確認（たった今、または時間前の表示）
      const page = screen.getByRole('main');
      expect(page.textContent).toMatch(/前|たった今/);
    });
  });

  it('should display difficulty levels', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue(mockSessions);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/beginner|初級/i)).toBeInTheDocument();
      expect(screen.getByText(/intermediate|中級/i)).toBeInTheDocument();
    });
  });

  it('should display empty state when no sessions', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue([]);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/履歴がありません|No history/i)
      ).toBeInTheDocument();
    });
  });

  it('should have link to practice page', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue([]);

    render(<HistoryPage />);

    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: /練習|Practice/i });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/practice');
    });
  });

  it('should have link to home page', async () => {
    (operations.getRecentSessions as jest.Mock).mockResolvedValue([]);

    render(<HistoryPage />);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /ホーム|Home/i });
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
