/**
 * TypingAreaコンポーネントのテスト（Red）
 */
import { render, screen, fireEvent } from '@testing-library/react';
import TypingArea from './TypingArea';

describe('TypingArea', () => {
  const defaultProps = {
    targetText: 'Hello',
    onTypingComplete: jest.fn(),
    onTypingChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the target text', () => {
    render(<TypingArea {...defaultProps} />);
    // 各文字が個別のspanでレンダリングされるため、個別に確認
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('e')).toBeInTheDocument();
    expect(screen.getAllByText('l')).toHaveLength(2);
    expect(screen.getByText('o')).toBeInTheDocument();
  });

  it('should render an input field', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should update on user input', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'H' } });
    expect(input.value).toBe('H');
  });

  it('should call onTypingChange when input changes', () => {
    const onTypingChange = jest.fn();
    render(<TypingArea {...defaultProps} onTypingChange={onTypingChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(onTypingChange).toHaveBeenCalled();
  });

  it('should display correct characters in green', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'H' } });

    // 正解の文字が緑色で表示されることを確認
    const correctChar = screen.getByText('H');
    expect(correctChar).toHaveClass('text-green-500');
  });

  it('should display incorrect characters in red', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'X' } });

    // 不正解の文字が赤色で表示されることを確認
    const incorrectChar = screen.getByText('H');
    expect(incorrectChar).toHaveClass('text-red-500');
  });

  it('should display untyped characters in gray', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'He' } });

    // 未入力の文字がグレーで表示されることを確認
    const allSpans = screen.getAllByText(/[Helo]/);
    // 最後の3文字（llo）がグレー
    const untypedSpans = allSpans.filter(span => span.className.includes('text-gray-400'));
    expect(untypedSpans.length).toBeGreaterThanOrEqual(3);
  });

  it('should call onTypingComplete when typing is finished', () => {
    const onTypingComplete = jest.fn();
    render(<TypingArea {...defaultProps} onTypingComplete={onTypingComplete} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(onTypingComplete).toHaveBeenCalled();
  });

  it('should not allow input beyond target text length', () => {
    render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // まず正常な長さの入力
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');

    // 長さを超える入力を試みる（入力は変更されないはず）
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input.value).toBe('Hello');
  });

  it('should handle Japanese text', () => {
    const japaneseProps = {
      ...defaultProps,
      targetText: 'こんにちは',
    };
    render(<TypingArea {...japaneseProps} />);

    // 各文字が個別にレンダリングされるため、個別に確認
    expect(screen.getByText('こ')).toBeInTheDocument();
    expect(screen.getByText('ん')).toBeInTheDocument();
    expect(screen.getByText('に')).toBeInTheDocument();
    expect(screen.getByText('ち')).toBeInTheDocument();
    expect(screen.getByText('は')).toBeInTheDocument();
  });

  it('should reset input when target text changes', () => {
    const { rerender } = render(<TypingArea {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');

    // targetTextが変更された場合、入力をリセット
    rerender(<TypingArea {...defaultProps} targetText="World" />);
    expect(input.value).toBe('');
  });
});
