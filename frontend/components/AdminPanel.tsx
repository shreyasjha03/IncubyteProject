'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { getToken } from '@/utils/auth';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface AdminPanelProps {
  onSweetAdded: () => void;
  onSweetUpdated: () => void;
  sweets: Sweet[];
}

export default function AdminPanel({ onSweetAdded, onSweetUpdated, sweets }: AdminPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setFormData({ ...formData, imageUrl: '' }); // Clear URL when file is selected
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = getToken();
      if (!token) {
        throw new Error('You must be logged in to upload images. Please log out and log in again.');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      // For FormData, browser will set Content-Type with boundary automatically
      // Don't manually set Content-Type header
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Upload failed with status ${response.status}` };
        }
        
        // If unauthorized, suggest re-login
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log out and log in again, then try uploading.');
        }
        
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      // Set the uploaded image URL (full URL to backend)
      const backendUrl = API_URL.replace('/api', '');
      const imageUrl = `${backendUrl}${data.url}`;
      setFormData(prev => ({ ...prev, imageUrl }));
      setSelectedFile(null);
      // Reset file input
      const input = document.getElementById('imageFile') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If file is selected but not uploaded yet, upload it first
      let imageUrl = formData.imageUrl;
      if (selectedFile && !formData.imageUrl) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('image', selectedFile);

        const token = getToken();
        if (!token) {
          throw new Error('You must be logged in to upload images. Please log in again.');
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        
        // Don't set Content-Type header - let the browser set it with boundary for FormData
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Do NOT set Content-Type - browser will set it automatically with boundary
          },
          body: formDataToUpload,
        });

        if (!uploadResponse.ok) {
          let errorData;
          try {
            errorData = await uploadResponse.json();
          } catch {
            errorData = { message: `Upload failed with status ${uploadResponse.status}` };
          }
          
          // If unauthorized, suggest re-login
          if (uploadResponse.status === 401) {
            throw new Error('Authentication failed. Please log out and log in again, then try uploading.');
          }
          
          throw new Error(errorData.message || 'Upload failed');
        }

        const uploadData = await uploadResponse.json();
        const backendUrl = API_URL.replace('/api', '');
        imageUrl = `${backendUrl}${uploadData.url}`;
      }

      await api.post('/sweets', {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        imageUrl: imageUrl || undefined,
      });
      setFormData({ name: '', category: '', price: '', quantity: '', imageUrl: '' });
      setSelectedFile(null);
      // Reset file input
      const input = document.getElementById('imageFile') as HTMLInputElement;
      if (input) input.value = '';
      onSweetAdded();
    } catch (err: any) {
      // Handle validation errors
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e: any) => `${e.param}: ${e.msg}`)
          .join(', ');
        setError(`Validation errors: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to add sweet');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 glass bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-gray-100/50 animate-fade-in">
      <h2 className="text-2xl font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Sweet
      </h2>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category *
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              required
              min="0"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              min="0"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-1.5">
              📸 Upload Image from Computer (Recommended)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="imageFile"
                className="flex-1 px-4 py-2.5 border-2 border-dashed border-amber-400 rounded-xl text-gray-900 bg-amber-50 hover:bg-amber-100 cursor-pointer text-center transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedFile ? selectedFile.name : 'Choose Image File (Max 5MB)'}
              </label>
              {selectedFile && (
                <>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      'Upload'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      const input = document.getElementById('imageFile') as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
            {selectedFile && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  📎 Selected: <span className="font-semibold">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-amber-300 shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preview (click Upload to save)</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                if (selectedFile) {
                  setSelectedFile(null);
                  const input = document.getElementById('imageFile') as HTMLInputElement;
                  if (input) input.value = '';
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.imageUrl ? 'Using uploaded/custom image' : 'Leave empty to use default image'}
            </p>
          </div>
          {formData.imageUrl && !selectedFile && (
            <div className="mt-2">
              <p className="text-xs text-green-600 font-semibold mb-1">✅ Image URL set successfully!</p>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-green-300 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
        >
          {loading ? 'Adding...' : 'Add Sweet'}
        </button>
      </form>
    </div>
  );
}

