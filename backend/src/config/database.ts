import { Pool } from "pg";

// create a DB pool (re-uses connections)
const isProduction = process.env.NODE_ENV === "production";

// Pool for cars database (car_rental_db)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Pool for users database (car_rental_user_data)
export const userPool = new Pool({
  connectionString: process.env.USER_DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test connections on startup
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("USER_DATABASE_URL:", process.env.USER_DATABASE_URL);
