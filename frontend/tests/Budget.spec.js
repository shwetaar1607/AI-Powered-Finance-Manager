import { test, expect } from "@playwright/test";

test.describe("Budget Page", () => {
  test.beforeEach(async ({ page }) => {
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
    await page.keyboard.press("Escape");
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("should open and close Add Expense modal", async ({ page }) => {
    await page.getByRole("button", { name: /Add Expense/i }).click();
    await expect(page.locator(".modal")).toBeVisible();
    await page.keyboard.press("Escape");
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

  test("should delete a budget after confirmation", async ({ page }) => {
    const deleteButtons = page.locator("button >> svg").filter({ hasText: "" });
    if ((await deleteButtons.count()) > 0) {
      page.once("dialog", (dialog) => dialog.accept());
      await deleteButtons.first().click();
      await expect(deleteButtons.first()).not.toBeVisible();
    }
  });

  test("should filter expenses by month", async ({ page }) => {
    await page.selectOption("#monthFilter", { label: "March" });
    await expect(page.locator("text=March")).toBeVisible();
  });

  test("should show message when no expenses in filtered month", async ({
    page,
  }) => {
    await page.selectOption("#monthFilter", { label: "December" });
    await expect(page.locator("text=No expenses found")).toBeVisible();
  });
});
