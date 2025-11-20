-- Migration: Add minimum_stock column to inventory_items table
-- Date: 2025-01-XX
-- Description: Adds minimum_stock field to track low stock thresholds for inventory items

ALTER TABLE inventory_items 
ADD COLUMN IF NOT EXISTS minimum_stock INT NOT NULL DEFAULT 0;

-- Update existing records to have a default minimum stock of 0 if needed
UPDATE inventory_items 
SET minimum_stock = 0 
WHERE minimum_stock IS NULL;

