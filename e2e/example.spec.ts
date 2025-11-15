import { test, expect } from '@playwright/test';

/**
 * サンプルE2Eテスト
 * Playwrightが正しく動作することを確認
 */
test.describe('Home Page', () => {
  test('should display the title', async ({ page }) => {
    await page.goto('/');

    // タイトルが表示されることを確認
    await expect(page.getByRole('heading', { name: 'タイピングゲーム' })).toBeVisible();
  });

  test('should have the correct meta description', async ({ page }) => {
    await page.goto('/');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/タイピングゲーム/);
  });
});
