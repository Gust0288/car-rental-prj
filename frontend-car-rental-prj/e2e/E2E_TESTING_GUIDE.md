# End-to-End Testing Guide for Car Rental Project

## Configuration

- **File**: `playwright.config.ts`
- Tests run against `http://localhost:5173` (your Vite dev server)
- Reporter: HTML report generated after tests
- Screenshots on failure enabled
- Supports running on mobile viewports (!!To be implemented!!)

## Setup Instructions

### 1. Install Playwright

```bash
cd frontend-car-rental-prj
npm install -D @playwright/test
```

### 2. Initialize Playwright Config

```bash
npx playwright install
```

This creates a `playwright.config.ts` file with default configuration.

### 3. Update Your package.json Scripts

Add these to the `scripts` section:

```json
"test:e2e": "playwright test",
"test:e2e:debug": "playwright test --debug",
"test:e2e:headed": "playwright test --headed"
```

**Create test user**: Add `test@example.com` / `password123` to your database

### 4. Run Tests

**Start your dev servers first:**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend-car-rental-prj
npm run dev

# Terminal 3: Run tests
npm run test:e2e
npm run test:e2e:headed # with browser view
```
