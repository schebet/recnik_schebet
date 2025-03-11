import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      setUploading(true);
      setError(null);
      setSuccess(false);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Морате одабрати слику за отпремање.');
      }

      const file = event.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Слика мора бити мања од 2MB.');
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        throw new Error('Дозвољени формати су: JPG, PNG и WebP.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `header-image.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setSuccess(true);
      
      // Reload the page to show the new image
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Грешка при отпремању слике');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Отпреми слику заглавља</h2>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
          Слика је успешно отпремљена! Страница ће се освежити...
        </div>
      )}

      <div className="mt-4">
        <label className="block">
          <span className="sr-only">Одабери слику заглавља</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={uploadImage}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-4 text-center text-gray-600">
          Отпремање у току...
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Максимална величина: 2MB</p>
        <p>Подржани формати: JPG, PNG, WebP</p>
      </div>
    </div>
  );
}