/**
 * セットアップ確認用ダミーテスト
 * Jest と React Testing Library が正しく動作することを確認
 */
describe('Test Environment Setup', () => {
  it('should pass a simple assertion', () => {
    expect(true).toBe(true);
  });

  it('should perform basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const str = 'Hello, World!';
    expect(str).toContain('World');
  });
});
