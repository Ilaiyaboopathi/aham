import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest, uploadFile } from '../utils/api';
import { CloudArrowUpIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await apiRequest('/api/admin/media/library');
      setMediaItems(data);
    } catch (error) {
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      await uploadFile(file);
      toast.success('Image uploaded successfully');
      loadMedia();
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;

    try {
      await apiRequest(`/api/admin/media/${id}`, { method: 'DELETE' });
      toast.success('Media deleted successfully');
      loadMedia();
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const copyToClipboard = (url) => {
    const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('URL copied to clipboard');
  };

  const filteredMedia = mediaItems.filter(item =>
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600 mt-1">Upload and manage images</p>
        </div>
        <label className="admin-btn admin-btn-primary flex items-center space-x-2 cursor-pointer">
          <CloudArrowUpIcon className="h-5 w-5" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            data-testid="upload-media-input"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="admin-card">
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by filename..."
              data-testid="search-media-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No media files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                className="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${item.url}`}
                    alt={item.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{item.file_name}</p>
                  <p className="text-xs text-gray-400">
                    {(item.file_size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    data-testid={`copy-url-${item._id}`}
                    className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    data-testid={`delete-media-${item._id}`}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaLibrary;