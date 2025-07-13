import { test, expect } from '@playwright/test';

// Test configuration (reviewer should set these via environment variables or .env file)
const email = process.env.HUDL_EMAIL || 'YOUR_EMAIL';
const validPassword = process.env.HUDL_PASSWORD || 'YOUR_PASSWORD';
const invalidPassword = 'invalid_password';
const displayName = process.env.HUDL_DISPLAY_NAME || 'USER_DISPLAY_NAME'; // Placeholder for user display name
const initials = process.env.HUDL_INITIALS || 'USER_INITIALS'; // Placeholder for user initials
const apiLoginUrl = 'https://example.com/api/login'; // Placeholder API endpoint for demo purposes

// Reusable login navigation function
async function navigateToLogin(page) {
  await page.goto('https://www.hudl.com/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Hudl', exact: true }).nth(1).click();
}

test.describe('Hudl Login Automation Test Suite', () => {

  // Test 1: Successful Login & Logout Flow
  // Scenario: User logs in with valid credentials and logs out successfully.
  test('1. Successful login and logout flow', async ({ page }) => {
    await navigateToLogin(page);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(displayName)).toBeVisible();

    // Logout
    await page.getByText(displayName).click();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page).toHaveURL('https://www.hudl.com/');
  });

  // Test 2: Invalid Password Error Message
  // Scenario: User attempts to login with an incorrect password, triggering an error message.
  test('2. Invalid password should trigger error message', async ({ page }) => {
    await navigateToLogin(page);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(invalidPassword);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/incorrect/i)).toBeVisible();
  });

  // Test 3: Password Reset Flow
  // Scenario: Verify that password reset flow is accessible and functional.
  test('3. Password reset flow accessibility', async ({ page }) => {
    await navigateToLogin(page);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('link', { name: 'Forgot Password' }).click();
  });

  // Test 4: Password Visibility Toggle
  // Scenario: Verify the password visibility toggle functions as expected.
  test('4. Password visibility toggle functionality', async ({ page }) => {
    await navigateToLogin(page);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(validPassword);

    // Show password toggle
    await page.getByRole('button', { name: 'Show password' }).click();
    const inputType = await page.getByLabel('Password').getAttribute('type');
    expect(inputType).toBe('text');

    // Hide password toggle
    await page.getByRole('button', { name: 'Hide password' }).click();
    const hiddenType = await page.getByLabel('Password').getAttribute('type');
    expect(hiddenType).toBe('password');
  });

  // Test 5: Existing Account Creation Error
  // Scenario: User attempts to create an account using an existing email, triggering an error message.
  test('5. Existing account creation should trigger error message', async ({ page }) => {
    await navigateToLogin(page);

    // Click on "Create Account" link
    await page.getByRole('link', { name: 'Create Account' }).click();

    // Fill out account creation form with existing email
    await page.getByLabel('First Name*').fill('TestFirstName');
    await page.getByLabel('Last Name*').fill('TestLastName');
    await page.getByLabel('Email').fill(email);

    // Enter valid password and attempt account creation
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Assert error message is visible for existing account
    await expect(page.getByText(/already.*exists|account.*exists/i)).toBeVisible();
  });

  // Test 6: Terms of Service & Privacy Policy Links (Pre-Auth)
  // Scenario: Verify legal links open correct pages pre-login.
  async function verifyAndClosePopup(page, linkText, expectedUrlPattern) {
    const popup = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: linkText }).click(),
    ]).then(([popup]) => popup);
    await expect(popup).toHaveURL(expectedUrlPattern);
    await popup.close();
  }
  test('6. TOS and Privacy Policy Pre-Auth', async ({ page }) => {
    await page.goto('https://www.hudl.com/');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Hudl', exact: true }).nth(1).click();
  
    // Verify Privacy Policy popup
    await verifyAndClosePopup(page, 'Privacy Policy', /privacy/i);
  
    // Verify Terms of Service popup
    await verifyAndClosePopup(page, 'Terms of Service', /terms/i);
  });

  // Test 7: Session Persistence after Reload
  // Scenario: Verify that the user remains logged in after a page refresh.
  // ⚠️ Note: Many apps require explicit session/cookie storage for persistence across reloads in automation.
  // This test is included to demonstrate forward-looking test coverage for session management concepts.
  test('7. Session persistence after page reload', async ({ page }) => {
    await navigateToLogin(page);

    // Login with valid credentials
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Initial log in check
    await expect(page.getByText(displayName)).toBeVisible();

    // Reload the page 3 times and confirm user stays logged in
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await expect(page.getByText(displayName)).toBeVisible();
    }
    
    // Log out after final reload
    await page.getByText(displayName).click();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page).toHaveURL('https://www.hudl.com/');
  });

  // Test 8: Successful Login via API (Placeholder)
  // Scenario: Demonstrates expected API login structure for future implementation.
  test.skip('8. Successful login via API (Placeholder)', async ({ request }) => {
    const response = await request.post(apiLoginUrl, {
      data: { email, password: validPassword },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  // Test 9: Invalid Login via API (Placeholder)
  // Scenario: Demonstrates failed API login structure for future use.
  test.skip('9. Invalid login via API (Placeholder)', async ({ request }) => {
    const response = await request.post(apiLoginUrl, {
      data: { email, password: invalidPassword },
    });
    expect(response.status()).toBe(401);
  });

  // Test 10: Mobile Viewport Login Test (Placeholder)
  // Scenario: Placeholder test for simulating login behavior on a mobile device (e.g. iPhone).
  // ⚠️ Note: Viewport testing not currently implemented due to limitations in this test setup.
  test.skip('10. Responsive login page renders correctly on mobile', async ({ page }) => {
    // Implementation of device emulation would go here (e.g., using devices['iPhone 13'])
  });

  // Test 11: Post-Auth Account Settings Navigation
  // Scenario: User logs in, navigates account sections, and logs out.
  test('11. Post-Auth Account Settings Navigation', async ({ page }) => {
    await navigateToLogin(page);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Navigate to Account Settings and back to home screen
    await page.getByRole('heading', { name: initials }).click();
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.goto('https://www.hudl.com/home');

    // Navigate to tickets & passes section of account settings
    await page.getByRole('heading', { name: initials }).click();
    await page.getByRole('link', { name: 'Tickets & Passes' }).click();
    await page.goto('https://www.hudl.com/home');

    // Navigate to Get Help section, open and close chatbot
    await page.getByRole('heading', { name: initials }).click();
    await page.getByRole('link', { name: 'Get Help' }).click();
    await page.frameLocator('#decagon-iframe').getByLabel('Close chat window').click();

    // Navigate back to home screen and logout
    await page.getByRole('heading', { name: initials }).click();
    await page.getByRole('link', { name: 'Log Out' }).click();
  });

});
