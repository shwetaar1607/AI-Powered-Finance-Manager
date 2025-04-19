import { test, expect } from '@playwright/test';

test.describe('SignUp Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
  });

  test('should display Sign Up title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  });

  test('should have name, email, password, confirm password fields', async ({ page }) => {
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password', exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Confirm Password' })).toBeVisible();
  });

  test('should show error if passwords do not match', async ({ page }) => {
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password321');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const togglePassword = page.locator('button').nth(0); // 1st toggle (Password)

    await passwordInput.fill('sample123');
    await togglePassword.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    const toggleConfirm = page.locator('button').nth(1); // 2nd toggle (Confirm)

    await confirmPasswordInput.fill('sample123');
    await toggleConfirm.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to SignIn page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*signin/);
  });

  // Uncomment below and adapt if you have test backend for successful sign up
  test('should create account successfully', async ({ page }) => {
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(`user${Date.now()}@test.com`);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
  
    await expect(page).toHaveURL(/.*signin/); // assuming it redirects to signin
  });
});
