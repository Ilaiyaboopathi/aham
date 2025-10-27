import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

function ProductModal({ product, onClose }) {
  const isEdit = Boolean(product);
  const [formData, setFormData] = useState({
    title_en: product?.title_en || '',
    title_ta: product?.title_ta || '',
    description_en: product?.description_en || '',
    description_ta: product?.description_ta || '',
    icon: product?.icon || 'HomeIcon',
    image_url: product?.image_url || '',
    features: product?.features || ['', '', ''],
    gradient: product?.gradient || 'from-blue-500 to-indigo-600',
    order_index: product?.order_index || 0,
    status: product?.status ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = isEdit
        ? `/api/admin/products/${product._id}`
        : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'Create Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) *
              </label>
              <input
                type="text"
                data-testid="product-title-en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Tamil) *
              </label>
              <input
                type="text"
                data-testid="product-title-ta"
                value={formData.title_ta}
                onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
                className="admin-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English) *
              </label>
              <textarea
                data-testid="product-desc-en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="admin-input"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Tamil) *
              </label>
              <textarea
                data-testid="product-desc-ta"
                value={formData.description_ta}
                onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
                className="admin-input"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Name *
              </label>
              <input
                type="text"
                data-testid="product-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="admin-input"
                placeholder="HomeIcon"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient *
              </label>
              <input
                type="text"
                data-testid="product-gradient"
                value={formData.gradient}
                onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                className="admin-input"
                placeholder="from-blue-500 to-indigo-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              data-testid="product-image-url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="admin-input"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (3 items)
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  type="text"
                  data-testid={`product-feature-${index}`}
                  value={formData.features[index] || ''}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="admin-input"
                  placeholder={`Feature ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                data-testid="product-order"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="product-status"
                data-testid="product-status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="product-status" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="save-product-button"
              disabled={saving}
              className="admin-btn admin-btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;