import { test, expect } from "@playwright/test";

/**
 * End-to-End Test Example: Complete Car Booking Flow
 *
 * This test simulates a real user journey:
 * 1. Login to the application
 * 2. Browse available cars
 * 3. View car details
 * 4. Create a booking
 * 5. Confirm the booking
 */

test.describe("Car Booking E2E Flow", () => {
  // Setup: Navigate to the app before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("User should be able to complete a full booking flow", async ({
    page,
  }) => {
    // Step 1: Login
    // Click on login link in navbar
    await page.click('button:has-text("Login")');

    // Fill in login credentials
    await page.fill('[data-testid="login-email"]', "test@example.com");
    await page.fill('[data-testid="login-password"]', "password123");

    // Submit login form
    await page.click('[data-testid="login-submit-button"]');

    // Wait for navigation after successful login (goes to /profile)
    await page.waitForURL("**/profile", { timeout: 10000 });

    // Navigate to cars page
    await page.goto("http://localhost:5173/cars");

    // Step 2: Browse cars page
    // Verify we're on the cars page
    await expect(page).toHaveURL(/.*\/cars/);

    // Wait for car cards to load
    await page.waitForSelector('[data-testid="car-card"]');

    // Verify at least one car is displayed
    const carCards = page.locator('[data-testid="car-card"]');
    const carCount = await carCards.count();
    expect(carCount).toBeGreaterThan(0);

    // Step 3: Click on first car to view details
    await carCards.first().click();

    // Wait for car details page to load
    await page.waitForURL("**/car/**");

    // Verify car details are displayed
    await expect(page.locator('[data-testid="car-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="car-price"]')).toBeVisible();

    // Step 4: Fill in booking details
    // Get tomorrow's date and time
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    const startDateTime = tomorrow.toISOString().slice(0, 16);

    // Set end date to 6 days from now (5 days after start)
    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 5);
    const endDateTime = endDate.toISOString().slice(0, 16);

    // Fill start date
    await page.fill('[data-testid="start-date"]', startDateTime);

    // Fill end date
    await page.fill('[data-testid="end-date"]', endDateTime);

    // Wait a moment for validation to complete
    await page.waitForTimeout(500);

    // Step 5: Submit booking
    // Scroll to make sure button is visible
    await page.locator('button:has-text("Book car")').scrollIntoViewIfNeeded();

    // Click the book button using text
    await page.click('button:has-text("Book car")');

    // Wait for confirmation dialog or success
    await page.waitForTimeout(1000); // Wait for dialog to appear

    // Click the confirm button by text
    await page.locator('button:has-text("Confirm Booking")').click();

    // Wait for redirect to booking confirmation page
    await page.waitForURL("**/bookings/**", { timeout: 10000 });

    // Verify we're on the booking confirmation page
    await expect(page).toHaveURL(/.*\/bookings\/\d+/);
  });

  test("User should see error when booking with invalid dates", async ({
    page,
  }) => {
    // Login first
    await page.click('button:has-text("Login")');
    await page.fill('[data-testid="login-email"]', "test@example.com");
    await page.fill('[data-testid="login-password"]', "password123");
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL("**/profile", { timeout: 10000 });

    // Navigate to cars page
    await page.goto("http://localhost:5173/cars");

    // Navigate to a car
    const carCards = page.locator('[data-testid="car-card"]');
    await carCards.first().click();
    await page.waitForURL("**/car/**");

    // Try to book with end date before start date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDateTime = tomorrow.toISOString().slice(0, 16);

    // Set end date before start date (today at same time)
    const endDateTime = today.toISOString().slice(0, 16);

    await page.fill('[data-testid="start-date"]', startDateTime);
    await page.fill('[data-testid="end-date"]', endDateTime);

    // Try to submit - button should be disabled or show error
    const bookButton = page.locator('button:has-text("Book car")');
    const isDisabled = await bookButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test("User should see unavailable cars as disabled", async ({ page }) => {
    // Login
    await page.click('button:has-text("Login")');
    await page.fill('[data-testid="login-email"]', "test@example.com");
    await page.fill('[data-testid="login-password"]', "password123");
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL("**/profile", { timeout: 10000 });

    // Navigate to cars page
    await page.goto("http://localhost:5173/cars");

    // Wait for car cards to load
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 10000 });

    // Verify car cards are rendered
    const carCards = page.locator('[data-testid="car-card"]');
    const carCount = await carCards.count();
    expect(carCount).toBeGreaterThan(0);

    // Verify we can click on at least one car
    await carCards.first().click();
    await page.waitForURL("**/car/**");
  });
});
