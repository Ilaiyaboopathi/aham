import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

function BannerModal({ banner, onClose }) {
  const isEdit = Boolean(banner);
  const [formData, setFormData] = useState({
    title_en: banner?.title_en || '',
    title_ta: banner?.title_ta || '',
    subtitle_en: banner?.subtitle_en || '',
    subtitle_ta: banner?.subtitle_ta || '',
    cta_text_en: banner?.cta_text_en || '',
    cta_text_ta: banner?.cta_text_ta || '',
    cta_action: banner?.cta_action || 'enquiry',
    image_url: banner?.image_url || '',
    highlights: banner?.highlights || ['', '', ''],
    order_index: banner?.order_index || 0,
    status: banner?.status ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = isEdit
        ? `/api/admin/banners/${banner._id}`
        : '/api/admin/banners';
      const method = isEdit ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast.success(`Banner ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Banner' : 'Create Banner'}
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
                data-testid="banner-title-en"
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
                data-testid="banner-title-ta"
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
                Subtitle (English) *
              </label>
              <textarea
                data-testid="banner-subtitle-en"
                value={formData.subtitle_en}
                onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                className="admin-input"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (Tamil) *
              </label>
              <textarea
                data-testid="banner-subtitle-ta"
                value={formData.subtitle_ta}
                onChange={(e) => setFormData({ ...formData, subtitle_ta: e.target.value })}
                className="admin-input"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Text (English) *
              </label>
              <input
                type="text"
                data-testid="banner-cta-en"
                value={formData.cta_text_en}
                onChange={(e) => setFormData({ ...formData, cta_text_en: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Text (Tamil) *
              </label>
              <input
                type="text"
                data-testid="banner-cta-ta"
                value={formData.cta_text_ta}
                onChange={(e) => setFormData({ ...formData, cta_text_ta: e.target.value })}
                className="admin-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Action *
              </label>
              <select
                data-testid="banner-cta-action"
                value={formData.cta_action}
                onChange={(e) => setFormData({ ...formData, cta_action: e.target.value })}
                className="admin-input"
                required
              >
                <option value="enquiry">Enquiry</option>
                <option value="scorecard">Scorecard</option>
                <option value="pmay">PMAY</option>
                <option value="emi">EMI Calculator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                data-testid="banner-order"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              data-testid="banner-image-url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="admin-input"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlights (3 items)
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  type="text"
                  data-testid={`banner-highlight-${index}`}
                  value={formData.highlights[index] || ''}
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  className="admin-input"
                  placeholder={`Highlight ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="banner-status"
              data-testid="banner-status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label htmlFor="banner-status" className="ml-2 text-sm text-gray-700">
              Active
            </label>
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
              data-testid="save-banner-button"
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

export default BannerModal;