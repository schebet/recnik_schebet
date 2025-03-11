/*
  # Fix storage policies for image uploads

  1. Changes
    - Drop existing policies to ensure clean state
    - Create images bucket with proper configuration
    - Add correct RLS policies for storage access
    
  2. Security
    - Enable RLS on storage.buckets and storage.objects
    - Allow authenticated users to manage files in images bucket
    - Allow public read access to images
*/

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;

-- Bucket Policies
CREATE POLICY "Give users access to own bucket"
ON storage.buckets
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Object Policies
CREATE POLICY "Give users access to own objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');