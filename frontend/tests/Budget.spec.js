import { test, expect } from "@playwright/test";

test.describe("Budget Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign in page
    await page.goto("http://localhost:5173/signin");

    // Fill in login credentials (adjust selectors if needed)
<<<<<<< HEAD
    await page.getByLabel("Email").fill("test@gmail.com");
    await page.getByLabel("Password").fill("Test@123");
=======
    await page.getByLabel("Email").fill("vidyadharchalla333@gmail.com");
    await page.getByLabel("Password").fill("Vidya@123");
>>>>>>> eb39be279fb7f83e975ea8bdfd9d070c41433732

    // Submit the login form
    await page.getByRole("button", { name: /Sign In/i }).click();

    // Wait for redirect or manually go to budget page
    await page.waitForNavigation();
    await page.goto("http://localhost:5173/budget");
  });

  test("should display Budget Overview title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Budget Overview" })
    ).toBeVisible();
  });

  test("should show Add Budget and Add Expense buttons", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Add Budget/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Add Expense/i })
    ).toBeVisible();
  });

  test("should open and close Add Budget modal", async ({ page }) => {
    await page.getByRole("button", { name: /Add Budget/i }).click();
    await expect(page.locator(".modal")).toBeVisible();

    // Close using close button
    await page.getByRole("button", { name: /Cancel/i }).click(); // adjust if necessary
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("should open and close Add Expense modal", async ({ page }) => {
    await page.getByRole("button", { name: /Add Expense/i }).click();
    await expect(page.locator(".modal")).toBeVisible();
    await page.getByRole("button", { name: /Cancel/i }).click();
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("should display budget cards", async ({ page }) => {
    const budgetCards = page.locator("h3:text-is('Food')");
    await expect(budgetCards.first()).toBeVisible();
  });

  test("should show warning if budget is overspent", async ({ page }) => {
    const overBudget = page.locator("text=⚠ Over Budget");
    if ((await overBudget.count()) > 0) {
      await expect(overBudget.first()).toBeVisible();
    }
  });

  test("should filter expenses by month", async ({ page }) => {
    await page.selectOption("#monthFilter", { label: "March" });
  
<<<<<<< HEAD
    // Assert that the first matching "Month: March" paragraph is visible
    await expect(page.locator("p", { hasText: "Month: March" }).first()).toBeVisible();
=======
    // Assert that filtered expense with "Month: March" appears
    await expect(page.locator("p", { hasText: "Month: March" })).toBeVisible();
>>>>>>> eb39be279fb7f83e975ea8bdfd9d070c41433732
  });
  
});
