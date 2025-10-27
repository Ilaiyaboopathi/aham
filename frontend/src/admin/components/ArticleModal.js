import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

function ArticleModal({ article, onClose }) {
  const isEdit = Boolean(article);
  const [formData, setFormData] = useState({
    title_en: article?.title_en || '',
    title_ta: article?.title_ta || '',
    slug: article?.slug || '',
    content_en: article?.content_en || '',
    content_ta: article?.content_ta || '',
    thumbnail_url: article?.thumbnail_url || '',
    status: article?.status ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = isEdit
        ? `/api/admin/articles/${article._id}`
        : '/api/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast.success(`Article ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (value) => {
    setFormData({
      ...formData,
      title_en: value,
      slug: !isEdit ? generateSlug(value) : formData.slug
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Article' : 'Create Article'}
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
                data-testid="article-title-en"
                value={formData.title_en}
                onChange={(e) => handleTitleChange(e.target.value)}
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
                data-testid="article-title-ta"
                value={formData.title_ta}
                onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
                className="admin-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              data-testid="article-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="admin-input font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (English) *
              </label>
              <textarea
                data-testid="article-content-en"
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                className="admin-input"
                rows="6"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Tamil) *
              </label>
              <textarea
                data-testid="article-content-ta"
                value={formData.content_ta}
                onChange={(e) => setFormData({ ...formData, content_ta: e.target.value })}
                className="admin-input"
                rows="6"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL *
            </label>
            <input
              type="url"
              data-testid="article-thumbnail-url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="admin-input"
              placeholder="https://example.com/thumbnail.jpg"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="article-status"
              data-testid="article-status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label htmlFor="article-status" className="ml-2 text-sm text-gray-700">
              Published
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
              data-testid="save-article-button"
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

export default ArticleModal;