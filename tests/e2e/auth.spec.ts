import { test, expect } from "@playwright/test";

test.describe("Sprint 14 Walking Skeleton — Routing and Form Verification", () => {
  test("Behavior 1: Anonymous visitor opening /dashboard is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /sign in to educore/i })).toBeVisible();
  });

  test("Behavior 2: Anonymous visitor opening root / is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Behavior 9a: Login form displays validation errors on invalid inputs without crashing", async ({
    page,
  }) => {
    await page.goto("/login");

    // Click submit with empty fields
    await page.getByRole("button", { name: /sign in/i }).click();

    // Check validation error messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();

    // Enter invalid email format
    await page.getByLabel(/email address/i).fill("not-an-email");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();

    // Enter short password
    await page.getByLabel(/password/i).fill("123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/password must be at least 8 characters long/i)).toBeVisible();
  });

  test("Behavior 9b: Register form validates matching passwords and full name length", async ({
    page,
  }) => {
    await page.goto("/register");

    // Fill form with mismatched passwords
    await page.getByLabel(/full name/i).fill("Test Student");
    await page.getByLabel(/email address/i).fill("student@example.com");
    await page.getByLabel(/^password/i).fill("Password123!");
    await page.getByLabel(/confirm password/i).fill("DifferentPassword123!");

    await page.getByRole("button", { name: /register/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("Navigation: Links between /login and /register work cleanly", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/register/);

    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
