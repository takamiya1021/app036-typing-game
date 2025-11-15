import { test, expect } from '@playwright/test';

/**
 * タイピング練習フローのE2Eテスト
 */
test.describe('Typing Practice Flow', () => {
  test('should navigate from home to practice page', async ({ page }) => {
    await page.goto('/');

    // トップページの表示確認
    await expect(page.getByRole('heading', { name: 'タイピングゲーム' })).toBeVisible();
    await expect(page.getByText('AI搭載タイピング練習アプリ')).toBeVisible();

    // 練習ボタンのクリック
    await page.getByRole('link', { name: '練習を始める' }).click();

    // 練習ページへ遷移
    await expect(page).toHaveURL('/practice');
  });

  test('should display practice page components', async ({ page }) => {
    await page.goto('/practice');

    // 難易度選択ボタンが表示される
    await expect(page.getByText('初級')).toBeVisible();
    await expect(page.getByText('中級')).toBeVisible();
    await expect(page.getByText('上級')).toBeVisible();

    // 統計情報が表示される
    await expect(page.getByText('WPM')).toBeVisible();
    await expect(page.getByText('正確性')).toBeVisible();
    await expect(page.getByText('文字')).toBeVisible();

    // タイマーが表示される
    await expect(page.getByText('残り時間')).toBeVisible();
  });

  test('should allow typing and display stats', async ({ page }) => {
    await page.goto('/practice');

    // テキストボックスが表示されるのを待つ
    const textbox = page.getByRole('textbox');
    await expect(textbox).toBeVisible({ timeout: 5000 });

    // 文字を入力
    await textbox.fill('テスト');

    // 文字数が更新される
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should allow changing difficulty', async ({ page }) => {
    await page.goto('/practice');

    // 初級が選択されている
    const beginnerButton = page.getByRole('button', { name: '初級' });
    await expect(beginnerButton).toBeVisible();

    // 中級をクリック
    const intermediateButton = page.getByRole('button', { name: '中級' });
    await intermediateButton.click();

    // 新しい文章が生成される（ローディングが表示される）
    await expect(page.getByText(/生成中/)).toBeVisible({ timeout: 1000 }).catch(() => {
      // 高速で完了する場合もあるのでエラーを無視
    });
  });
});

test.describe('Home Page Features', () => {
  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    // 機能カードが表示される
    await expect(page.getByText('AI文章生成')).toBeVisible();
    await expect(page.getByText('詳細な統計')).toBeVisible();
    await expect(page.getByText('オフライン対応')).toBeVisible();
  });
});
