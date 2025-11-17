-- Update car_location column with Danish cities
-- Run this on your Render PostgreSQL database if car_location is NULL

UPDATE cars 
SET car_location = (
    CASE 
        WHEN id % 3 = 0 THEN 'Copenhagen'
        WHEN id % 3 = 1 THEN 'Aarhus'
        ELSE 'Odense'
    END
)
WHERE car_location IS NULL OR car_location = '';

-- Verify the update
SELECT id, make, model, car_location FROM cars LIMIT 10;
