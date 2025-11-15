/**
 * Timerコンポーネントのテスト（Red）
 */
import { render, screen, act } from '@testing-library/react';
import Timer from './Timer';

// タイマーのモック
jest.useFakeTimers();

describe('Timer', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should display initial time', () => {
    render(<Timer duration={60} onComplete={jest.fn()} />);
    expect(screen.getByText(/01:00/)).toBeInTheDocument();
  });

  it('should display time in MM:SS format', () => {
    render(<Timer duration={90} onComplete={jest.fn()} />);
    expect(screen.getByText(/01:30/)).toBeInTheDocument();
  });

  it('should countdown when started', () => {
    render(<Timer duration={60} onComplete={jest.fn()} isActive={true} />);
    expect(screen.getByText(/01:00/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/00:59/)).toBeInTheDocument();
  });

  it('should not countdown when not active', () => {
    render(<Timer duration={60} onComplete={jest.fn()} isActive={false} />);
    expect(screen.getByText(/01:00/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText(/01:00/)).toBeInTheDocument();
  });

  it('should call onComplete when timer reaches 0', () => {
    const onComplete = jest.fn();
    render(<Timer duration={3} onComplete={onComplete} isActive={true} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('should display 00:00 when time is up', () => {
    const onComplete = jest.fn();
    render(<Timer duration={2} onComplete={onComplete} isActive={true} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/00:00/)).toBeInTheDocument();
  });

  it('should stop at 0 and not go negative', () => {
    const onComplete = jest.fn();
    render(<Timer duration={1} onComplete={onComplete} isActive={true} />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText(/00:00/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should reset when duration prop changes', () => {
    const { rerender } = render(<Timer duration={60} onComplete={jest.fn()} />);
    expect(screen.getByText(/01:00/)).toBeInTheDocument();

    rerender(<Timer duration={30} onComplete={jest.fn()} />);
    expect(screen.getByText(/00:30/)).toBeInTheDocument();
  });

  it('should display label if provided', () => {
    render(<Timer duration={60} onComplete={jest.fn()} label="残り時間" />);
    expect(screen.getByText(/残り時間/)).toBeInTheDocument();
  });

  it('should handle large durations', () => {
    render(<Timer duration={3599} onComplete={jest.fn()} />);
    expect(screen.getByText(/59:59/)).toBeInTheDocument();
  });
});
