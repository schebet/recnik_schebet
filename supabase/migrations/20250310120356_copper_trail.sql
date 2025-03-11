/*
  # Create Words Table for Zaplanjski Dictionary

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `word` (text, the dialect word)
      - `meaning` (text, the meaning in standard Serbian)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `words` table
    - Add policies for:
      - Anyone can read words
      - Authenticated users can insert their own words
      - Users can update and delete their own words
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  word text NOT NULL,
  meaning text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Everyone can read words
CREATE POLICY "Words are viewable by everyone"
  ON words
  FOR SELECT
  USING (true);

-- Users can insert their own words
CREATE POLICY "Users can insert their own words"
  ON words
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own words
CREATE POLICY "Users can update their own words"
  ON words
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own words
CREATE POLICY "Users can delete their own words"
  ON words
  FOR DELETE
  USING (auth.uid() = user_id);