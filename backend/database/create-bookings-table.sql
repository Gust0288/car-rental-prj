-- Create bookings table for car rental system
-- Run this in your car_rental_user_data database

CREATE TABLE IF NOT EXISTS bookings (
  id                  BIGSERIAL PRIMARY KEY,
  car_id              BIGINT NOT NULL, -- References cars(id) in car_rental_db (cross-database reference)
  user_id             BIGINT NOT NULL, -- from users service
  pickup_location_id  TEXT,            -- use BIGINT if you have locations table
  return_location_id  TEXT,
  pickup_at           TIMESTAMPTZ NOT NULL, -- store UTC
  return_at           TIMESTAMPTZ NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('pending','confirmed','in_progress','returned','canceled')),
  price_total         NUMERIC(10,2),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookings_car_time_status
  ON bookings (car_id, pickup_at, return_at, status);

-- Create index for user bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id
  ON bookings (user_id);

-- Optional but recommended: prevent overlaps in DB for active statuses
-- This requires the btree_gist extension
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add constraint to prevent double bookings
ALTER TABLE bookings
  ADD CONSTRAINT no_overlap_per_car
  EXCLUDE USING gist (
    car_id WITH =,
    tstzrange(pickup_at, return_at, '[)') WITH &&
  )
  WHERE (status IN ('pending','confirmed','in_progress'));

-- Success message
SELECT 'Bookings table created successfully!' AS message;
