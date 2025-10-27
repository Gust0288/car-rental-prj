// Simple API tests - no external packages required
// Run your server first: npm run dev
// Then run: node tests/simple-tests.js

import http from "http";

// Test configuration
const API_URL = "http://localhost:3000";
const PORT = 3000;

// Color output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

// Simple HTTP request helper
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      hostname: "localhost",
      port: PORT,
      path: path,
      method: method,
      headers: headers,
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: body ? JSON.parse(body) : {},
          });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test tracker
let passed = 0;
let failed = 0;

function logTest(name, success, message = "") {
  if (success) {
    console.log(`${colors.green}✅ PASS${colors.reset} - ${name}`);
    passed++;
  } else {
    console.log(`${colors.red}❌ FAIL${colors.reset} - ${name}`);
    if (message) console.log(`   ${colors.yellow}${message}${colors.reset}`);
    failed++;
  }
}

// Tests
async function runTests() {
  console.log(`\n${colors.blue}🧪 Starting API Tests...${colors.reset}\n`);
  console.log(
    `${colors.yellow}Make sure your server is running on ${API_URL}${colors.reset}\n`
  );

  try {
    // Test 1: GET /api/cars
    console.log(`${colors.blue}Testing: GET /api/cars${colors.reset}`);
    const carsResponse = await makeRequest("GET", "/api/cars");
    logTest(
      "GET /api/cars returns 200",
      carsResponse.status === 200,
      `Expected 200, got ${carsResponse.status}`
    );
    logTest(
      "GET /api/cars returns array",
      Array.isArray(carsResponse.body),
      `Expected array, got ${typeof carsResponse.body}`
    );
    if (Array.isArray(carsResponse.body) && carsResponse.body.length > 0) {
      logTest(
        "Cars have required fields",
        carsResponse.body[0].make && carsResponse.body[0].model,
        "Missing make or model field"
      );
    }

    console.log("");

    // Test 2: POST /api/auth/signup
    console.log(`${colors.blue}Testing: POST /api/auth/signup${colors.reset}`);
    const randomEmail = `test${Date.now()}@example.com`;
    const newUser = {
      username: `testuser${Date.now()}`,
      name: "Test User",
      email: randomEmail,
      password: "password123",
      confirmPassword: "password123",
    };

    const signupResponse = await makeRequest(
      "POST",
      "/api/auth/signup",
      newUser
    );
    logTest(
      "Signup with valid data returns 201",
      signupResponse.status === 201,
      `Expected 201, got ${signupResponse.status}`
    );
    logTest(
      "Signup returns success: true",
      signupResponse.body.success === true,
      `Expected success: true, got ${signupResponse.body.success}`
    );
    logTest(
      "Signup returns user object",
      signupResponse.body.user &&
        signupResponse.body.user.email === randomEmail,
      "User object missing or incorrect"
    );

    // Test 2b: Duplicate signup should fail
    const duplicateSignup = await makeRequest(
      "POST",
      "/api/auth/signup",
      newUser
    );
    logTest(
      "Duplicate signup returns 409",
      duplicateSignup.status === 409,
      `Expected 409, got ${duplicateSignup.status}`
    );

    // Test 2c: Missing fields should fail
    const invalidSignup = await makeRequest("POST", "/api/auth/signup", {
      email: "test@test.com",
    });
    logTest(
      "Signup with missing fields returns 400",
      invalidSignup.status === 400,
      `Expected 400, got ${invalidSignup.status}`
    );

    console.log("");

    // Test 3: POST /api/auth/login
    console.log(`${colors.blue}Testing: POST /api/auth/login${colors.reset}`);
    const loginData = {
      email: randomEmail,
      password: "password123",
    };

    const loginResponse = await makeRequest(
      "POST",
      "/api/auth/login",
      loginData
    );
    logTest(
      "Login with valid credentials returns 200",
      loginResponse.status === 200,
      `Expected 200, got ${loginResponse.status}`
    );
    logTest(
      "Login returns success: true",
      loginResponse.body.success === true,
      `Expected success: true, got ${loginResponse.body.success}`
    );
    logTest(
      "Login returns user object",
      loginResponse.body.user && loginResponse.body.user.email === randomEmail,
      "User object missing or incorrect"
    );

    // Test 3b: Wrong password should fail
    const wrongPassword = await makeRequest("POST", "/api/auth/login", {
      email: randomEmail,
      password: "wrongpassword",
    });
    logTest(
      "Login with wrong password returns 401",
      wrongPassword.status === 401,
      `Expected 401, got ${wrongPassword.status}`
    );

    // Test 3c: Non-existent user should fail
    const nonExistentUser = await makeRequest("POST", "/api/auth/login", {
      email: "nonexistent@example.com",
      password: "password123",
    });
    logTest(
      "Login with non-existent user returns 401",
      nonExistentUser.status === 401,
      `Expected 401, got ${nonExistentUser.status}`
    );

    // Test 3d: Missing credentials should fail
    const missingCreds = await makeRequest("POST", "/api/auth/login", {
      email: randomEmail,
    });
    logTest(
      "Login with missing password returns 400",
      missingCreds.status === 400,
      `Expected 400, got ${missingCreds.status}`
    );

    console.log("");

    // Test 4: DELETE /api/users/profile/:userId (create user via modular route to get token)
    console.log(
      `${colors.blue}Testing: DELETE /api/users/profile/:userId${colors.reset}`
    );

    // Create a user via the modular route which returns a token
    const deleteTestUser = {
      username: `deletetest${Date.now()}`,
      name: "Delete Test",
      user_last_name: "User",
      email: `deletetest${Date.now()}@example.com`,
      password: "Password123",
    };

    const signupForDelete = await makeRequest(
      "POST",
      "/api/users/signup",
      deleteTestUser
    );

    // Get the token and userId from the signup response
    const userToken = signupForDelete.body.token;
    const userId = signupForDelete.body.user?.id;

    if (!userToken || !userId) {
      logTest(
        "Delete user test setup",
        false,
        "Missing token or userId from signup"
      );
    } else {
      // Test 4a: Delete user with valid token
      const deleteResponse = await makeRequest(
        "DELETE",
        `/api/users/profile/${userId}`,
        null,
        userToken
      );
      logTest(
        "Delete user with valid token returns 200",
        deleteResponse.status === 200,
        `Expected 200, got ${deleteResponse.status}`
      );
      logTest(
        "Delete user returns success message",
        deleteResponse.body.message &&
          deleteResponse.body.message.includes("deleted"),
        "Missing or incorrect success message"
      );

      // Test 4b: Try to delete already deleted user
      const deleteAgain = await makeRequest(
        "DELETE",
        `/api/users/profile/${userId}`,
        null,
        userToken
      );
      logTest(
        "Delete already deleted user returns 404",
        deleteAgain.status === 404,
        `Expected 404, got ${deleteAgain.status}`
      );

      // Test 4c: Try to delete without token
      const deleteNoToken = await makeRequest(
        "DELETE",
        `/api/users/profile/${userId}`,
        null,
        null
      );
      logTest(
        "Delete user without token returns 401",
        deleteNoToken.status === 401,
        `Expected 401, got ${deleteNoToken.status}`
      );

      // Test 4d: Try to login with deleted user
      const loginDeleted = await makeRequest("POST", "/api/users/login", {
        email: deleteTestUser.email,
        password: deleteTestUser.password,
      });
      logTest(
        "Login with deleted user returns 401",
        loginDeleted.status === 401,
        `Expected 401, got ${loginDeleted.status}`
      );
    }
  } catch (error) {
    console.log(
      `\n${colors.red}❌ Error running tests:${colors.reset}`,
      error.message
    );
    console.log(
      `${colors.yellow}Make sure your server is running on ${API_URL}${colors.reset}`
    );
    process.exit(1);
  }

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log(`${colors.blue}📊 Test Summary:${colors.reset}`);
  console.log(`   ${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`   ${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`   Total:  ${passed + failed}`);
  console.log("=".repeat(50) + "\n");

  if (failed > 0) {
    process.exit(1);
  }
}

// Run the tests
runTests();
