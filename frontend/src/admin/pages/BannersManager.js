import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import BannerModal from '../components/BannerModal';

function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await apiRequest('/api/admin/banners');
      setBanners(data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await apiRequest(`/api/admin/banners/${id}`, { method: 'DELETE' });
      toast.success('Banner deleted successfully');
      loadBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingBanner(null);
    loadBanners();
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Hero Banners</h2>
          <p className="text-gray-600 mt-1">Manage homepage hero carousel banners</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          data-testid="create-banner-button"
          className="admin-btn admin-btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="admin-card">
        {banners.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No banners created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title (EN)</th>
                  <th>CTA Action</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id}>
                    <td>
                      <img
                        src={banner.image_url}
                        alt={banner.title_en}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </td>
                    <td className="font-medium">{banner.title_en}</td>
                    <td>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {banner.cta_action}
                      </span>
                    </td>
                    <td>{banner.order_index}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          banner.status ? 'admin-badge-success' : 'admin-badge-warning'
                        }`}
                      >
                        {banner.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          data-testid={`edit-banner-${banner._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          data-testid={`delete-banner-${banner._id}`}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default BannersManager;