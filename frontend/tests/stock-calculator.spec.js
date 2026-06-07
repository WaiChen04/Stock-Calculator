import { test, expect } from '@playwright/test';

test('debug', async ({ page }) => {
  await page.goto('/');

  await page.pause();
});


test('app loads with calculator form', async ({ page }) => {
  await page.goto('/');

  // Check main heading
  await expect(page.getByRole('heading', { name: /Maximum ROI Calculator for Stocks/i })).toBeVisible();
  // Check all form labels exist
  await expect(page.getByText('Stock Symbol:', { exact: true })).toBeVisible();
  await expect(page.getByText('Starting Investment:')).toBeVisible();
  await expect(page.getByText('Start Date:')).toBeVisible();
  await expect(page.getByText('End Date:')).toBeVisible();

  // Check fetch button exists
  await expect(page.getByRole('button', { name: 'Fetch Data' })).toBeVisible();
});

test('can fill form and submit', async ({ page }) => {
  await page.goto('/');
  
  // Fill in the stock symbol
  await page.getByRole('textbox', { name: 'Enter stock symbol (e.g. AAPL' }).fill('AAPL');
  
  // Fill in investment amount
  await page.getByRole('spinbutton').fill('1000');
  
  // Submit form
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  
  // After submit, we should see the stock symbol displayed
  await expect(page.getByRole('heading', { name: 'Stock Symbol: AAPL' })).toBeVisible({ timeout: 5000 });
});

test('shows no profitable trade message when applicable', async ({ page }) => {
  await page.goto('/');
  
  // Fill form with values that might not have profitable trades
  await page.getByRole('textbox', { name: 'Enter stock symbol (e.g. AAPL' }).fill('ZZZ');
  await page.getByRole('spinbutton').fill('500');
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  
  // Look for either profitable trade data or "No profitable trade found"
  await expect(page.getByText('No stock data available for')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('No profitable trade found.')).toBeVisible({ timeout: 10000 });
});

