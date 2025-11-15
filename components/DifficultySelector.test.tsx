/**
 * DifficultySelectorコンポーネントのテスト（Red）
 */
import { render, screen, fireEvent } from '@testing-library/react';
import DifficultySelector from './DifficultySelector';

describe('DifficultySelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all difficulty options', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    expect(screen.getByText(/初級|beginner/i)).toBeInTheDocument();
    expect(screen.getByText(/中級|intermediate/i)).toBeInTheDocument();
    expect(screen.getByText(/上級|advanced/i)).toBeInTheDocument();
  });

  it('should call onSelect when a difficulty is clicked', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    const intermediateButton = screen.getByText(/中級|intermediate/i);
    fireEvent.click(intermediateButton);

    expect(mockOnSelect).toHaveBeenCalledWith('intermediate');
  });

  it('should highlight the selected difficulty', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="intermediate" />);

    const intermediateButton = screen.getByText(/中級|intermediate/i).closest('button');
    expect(intermediateButton?.className).toContain('bg-blue'); // 選択中のボタンは青色
  });

  it('should not highlight unselected difficulties', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    const intermediateButton = screen.getByText(/中級|intermediate/i).closest('button');
    expect(intermediateButton?.className).not.toContain('bg-blue');
  });

  it('should update selection when clicked', () => {
    const { rerender } = render(
      <DifficultySelector onSelect={mockOnSelect} selected="beginner" />
    );

    const advancedButton = screen.getByText(/上級|advanced/i);
    fireEvent.click(advancedButton);

    expect(mockOnSelect).toHaveBeenCalledWith('advanced');

    // 選択を更新
    rerender(<DifficultySelector onSelect={mockOnSelect} selected="advanced" />);

    const advancedButtonAfter = screen.getByText(/上級|advanced/i).closest('button');
    expect(advancedButtonAfter?.className).toContain('bg-red'); // 上級は赤色
  });

  it('should be accessible with keyboard navigation', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should display difficulty labels in Japanese', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    expect(screen.getByText(/初級/)).toBeInTheDocument();
    expect(screen.getByText(/中級/)).toBeInTheDocument();
    expect(screen.getByText(/上級/)).toBeInTheDocument();
  });

  it('should handle multiple clicks on the same difficulty', () => {
    render(<DifficultySelector onSelect={mockOnSelect} selected="beginner" />);

    const beginnerButton = screen.getByText(/初級|beginner/i);
    fireEvent.click(beginnerButton);
    fireEvent.click(beginnerButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });
});
