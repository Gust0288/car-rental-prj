-- Migration: Add 'expired' status to bookings table
-- Run this on your Render PostgreSQL database

-- Drop the old constraint and add new one with 'expired' status
ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_status_check,
  ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('pending','confirmed','in_progress','returned','canceled','expired'));

-- Optionally, expire any overdue bookings immediately
UPDATE bookings
SET status = 'expired', updated_at = now()
WHERE status IN ('pending','confirmed','in_progress')
  AND return_at < now();

-- Success message
SELECT 'Successfully added expired status and updated overdue bookings!' AS message;
