/*
  # Add storage policies for image uploads

  1. Changes
    - Enable storage policies for the 'images' bucket
    - Add policies for authenticated users to:
      - Create and manage buckets
      - Upload and manage files in the images bucket

  2. Security
    - Only authenticated users can create/manage buckets
    - Only authenticated users can upload/manage files
    - Everyone can read public files
*/

-- Create images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to create and manage buckets
CREATE POLICY "Authenticated users can create buckets"
ON storage.buckets
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to upload files to the images bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update and delete their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (auth.uid() = owner AND bucket_id = 'images');

-- Allow public access to files in the images bucket
CREATE POLICY "Public can view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');