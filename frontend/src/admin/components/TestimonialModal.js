import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

function TestimonialModal({ testimonial, onClose }) {
  const isEdit = Boolean(testimonial);
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    location: testimonial?.location || '',
    rating: testimonial?.rating || 5,
    comment_en: testimonial?.comment_en || '',
    comment_ta: testimonial?.comment_ta || '',
    image_url: testimonial?.image_url || '',
    loan_type: testimonial?.loan_type || 'Home Construction Loan',
    order_index: testimonial?.order_index || 0,
    status: testimonial?.status ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = isEdit
        ? `/api/admin/testimonials/${testimonial._id}`
        : '/api/admin/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast.success(`Testimonial ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Testimonial' : 'Create Testimonial'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                data-testid="testimonial-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                data-testid="testimonial-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="admin-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <select
                data-testid="testimonial-rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="admin-input"
                required
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Type *
              </label>
              <input
                type="text"
                data-testid="testimonial-loan-type"
                value={formData.loan_type}
                onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
                className="admin-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (English) *
              </label>
              <textarea
                data-testid="testimonial-comment-en"
                value={formData.comment_en}
                onChange={(e) => setFormData({ ...formData, comment_en: e.target.value })}
                className="admin-input"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Tamil) *
              </label>
              <textarea
                data-testid="testimonial-comment-ta"
                value={formData.comment_ta}
                onChange={(e) => setFormData({ ...formData, comment_ta: e.target.value })}
                className="admin-input"
                rows="4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL *
            </label>
            <input
              type="url"
              data-testid="testimonial-image-url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="admin-input"
              placeholder="https://example.com/profile.jpg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                data-testid="testimonial-order"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="testimonial-status"
                data-testid="testimonial-status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="testimonial-status" className="ml-2 text-sm text-gray-700">
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
              data-testid="save-testimonial-button"
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

export default TestimonialModal;