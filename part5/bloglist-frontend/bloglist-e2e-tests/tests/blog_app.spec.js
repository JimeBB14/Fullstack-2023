const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');

    // Create a test user
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
      }
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('text=Login').first()).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.click('text=login');

      const usernameField = page.locator('input[name="username"]');
      const passwordField = page.locator('input[name="password"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
      await expect(passwordField).toBeVisible({ timeout: 10000 });

      await usernameField.fill('testuser');
      await passwordField.fill('password123');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Welcome Test User')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('text=login');

      const usernameField = page.locator('input[name="username"]');
      const passwordField = page.locator('input[name="password"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
      await expect(passwordField).toBeVisible({ timeout: 10000 });

      await usernameField.fill('testuser');
      await passwordField.fill('wrongpassword');
      await page.click('button[type="submit"]');

      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('Wrong username or password', { timeout: 10000 });
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.click('text=login');

      const usernameField = page.locator('input[name="username"]');
      const passwordField = page.locator('input[name="password"]');
      await usernameField.fill('testuser');
      await passwordField.fill('password123');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Welcome Test User')).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      await page.click('text=new blog');

      const titleField = page.locator('input[id="title"]');
      const authorField = page.locator('input[id="author"]');
      const urlField = page.locator('input[id="url"]');
      await titleField.fill('Test Blog');
      await authorField.fill('Test Author');
      await urlField.fill('http://testurl.com');
      await page.click('button[type="submit"]');

      
      await expect(page.locator('text=A new blog Test Blog by Test Author added')).toBeVisible({ timeout: 10000 });
    });

    test('a blog can be liked', async ({ page }) => {
        await page.click('text=new blog');
      
        const titleField = page.locator('input[id="title"]');
        const authorField = page.locator('input[id="author"]');
        const urlField = page.locator('input[id="url"]');
        await titleField.fill('Test Blog');
        await authorField.fill('Test Author');
        await urlField.fill('http://testurl.com');
        await page.click('button[type="submit"]');
      
    
        await expect(page.locator('text=Test Blog Test Author view')).toBeVisible({ timeout: 10000 });
      
      
        await page.click('text=view');
      
        
        const likeButton = page.locator('button', { hasText: 'like' });
        await expect(likeButton).toBeVisible({ timeout: 10000 });
        await likeButton.click();
      
       
        // Check that the likes have increased
  const likesField = page.locator('div.blogDetails p:has-text("likes 1")');
  await expect(likesField).toBeVisible({ timeout: 10000 });
      });
      
  });
});
