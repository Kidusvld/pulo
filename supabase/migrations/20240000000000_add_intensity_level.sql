
-- Add intensity_level column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS intensity_level text;
