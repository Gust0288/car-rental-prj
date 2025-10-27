# API Tests

Simple API tests without external packages - uses only Node.js built-in modules.

## How to Run Tests

1. **Start your API server:**

   ```bash
   npm run dev
   ```

2. **In a new terminal, run the tests:**
   ```bash
   node tests/simple-tests.js
   ```

## What's Being Tested

### GET /api/cars

- ✅ Returns 200 status code
- ✅ Returns an array
- ✅ Cars have required fields (make, model)

### POST /api/auth/signup

- ✅ Valid data returns 201
- ✅ Returns success: true
- ✅ Returns user object
- ✅ Duplicate email returns 409
- ✅ Missing fields returns 400

### POST /api/auth/login

- ✅ Valid credentials return 200
- ✅ Returns success: true
- ✅ Returns user object
- ✅ Wrong password returns 401
- ✅ Non-existent user returns 401
- ✅ Missing credentials return 400

## Test Output

```
🧪 Starting API Tests...

Testing: GET /api/cars
✅ PASS - GET /api/cars returns 200
✅ PASS - GET /api/cars returns array
✅ PASS - Cars have required fields

Testing: POST /api/auth/signup
✅ PASS - Signup with valid data returns 201
✅ PASS - Signup returns success: true
...

📊 Test Summary:
   Passed: 14
   Failed: 0
   Total:  14
```

## Troubleshooting

If tests fail:

1. Make sure your server is running on port 3000
2. Check that your database is connected
3. Verify the `users` table exists in your database
4. Check server logs for detailed error messages

## Note

These are **integration tests** - they test the actual API endpoints with real HTTP requests and database operations. Make sure your test database is set up correctly.
