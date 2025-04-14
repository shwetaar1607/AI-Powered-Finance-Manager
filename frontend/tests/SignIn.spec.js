// tests/SignIn.spec.ts
import { test, expect } from "@playwright/test";

test.describe("SignIn Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/signin");
  });

  test("should display Sign In title", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("should have email and password input fields", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("invalidpass");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Wait for error text (based on your UI message)
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("should navigate to SignUp page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel("Password");
    const toggleButton = page.locator("button").nth(0); // first button near input

    await passwordInput.fill("mypassword");
    await toggleButton.click();

    // Assert that input type is now "text"
    await expect(passwordInput).toHaveAttribute("type", "text");
  });
});
