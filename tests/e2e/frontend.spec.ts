import { test, expect } from '@playwright/test';

test.describe('Frontend E2E: Authentication Flow', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Login:');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should attempt login and show failure (missing Cognito config)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Since POOL_DATA is mocked with placeholders, it should fail or show an error
    const status = page.locator('#status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Login failed');
  });
});
