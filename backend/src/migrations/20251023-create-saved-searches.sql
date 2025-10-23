-- Migration: Create saved_searches table
-- Date: 2025-10-23
-- Description: Add saved searches functionality for advanced filtering

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  criteria TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('case', 'client', 'document', 'task', 'all')),
  is_shared BOOLEAN DEFAULT FALSE,
  description TEXT,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,
  use_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_type ON saved_searches(type);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_type ON saved_searches(user_id, type);
CREATE INDEX IF NOT EXISTS idx_saved_searches_last_used ON saved_searches(last_used_at DESC NULLS LAST);

-- Add comment to table
COMMENT ON TABLE saved_searches IS 'Stores user-saved search criteria for quick reuse';
COMMENT ON COLUMN saved_searches.criteria IS 'JSON string containing search filters and options';
COMMENT ON COLUMN saved_searches.is_shared IS 'Whether this search is shared with team members';
COMMENT ON COLUMN saved_searches.use_count IS 'Number of times this saved search has been used';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_saved_searches_updated_at_trigger
    BEFORE UPDATE ON saved_searches
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_searches_updated_at();
