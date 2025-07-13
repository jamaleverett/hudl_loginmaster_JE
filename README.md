# Hudl Login Automation Test Suite

This project is a Playwright-based automation suite designed to test core authentication flows for Hudl’s login system. It includes coverage for valid/invalid credentials, account creation errors, password visibility, privacy/TOS verification, session persistence, and future API & mobile responsiveness placeholders.

## 📁 File Structure

- `hudl-login-suite`: Contains redacted JavaScript and TypeScript test files demonstrating login automation flow.
  - `hudl-login-tests-redacted.js`
  - `hudl-login-tests-redacted.ts`
- `.env.example`: Environment variable template.
- `package.json`: Project dependencies and configuration.
- `tsconfig.json`: TypeScript compiler configuration
- `.gitignore`: Node and Playwright-specific ignore rules.
- `README.md`: Project overview 

## ✅ Features Covered

1. Successful login and logout
2. Invalid login handling
3. Password reset accessibility
4. Password visibility toggle
5. Duplicate account creation error
6. Privacy Policy and Terms of Service links (Pre-auth)
7. Session persistence after reload (Post-Auth)
8. Login via API (placeholder)
9. Invalid login via API (placeholder)
10. Responsive mobile login test (placeholder)
11. Post-auth account settings navigation

## ⚙️ Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in your credentials. (tests will fail without valid Hudl credentials)
4. Run the test suite with:

```bash
npx playwright test
```
5. Additional commands:

   - Run tests in headed mode (for visual debugging):
     ```bash
     npx playwright test --headed
     ```

   - Run tests in debug mode (for step-by-step inspection):
     ```bash
     npx playwright test --debug
     ```

   - View test report (after test execution):
     ```bash
     npx playwright show-report
     ```

   - Open a saved trace file (if enabled in test config):
     ```bash
     npx playwright show-trace trace.zip
       ```

## 📌 Notes

- Tests marked with .skip() are included to demonstrate the roadmap and coverage thought process.
- All credentials are redacted. The project is safe for public distribution.
- Both JS and TS versions are included to show flexibility and adaptability across codebases.

---

**Author**: Jamal Everett 

**Role**: Senior QA Manager

**Focus**: Hands-on E2E login automation validation using Playwright

**Tools Used**: Playwright · Node.js · dotenv · TypeScript · GitHub

**License**: None
