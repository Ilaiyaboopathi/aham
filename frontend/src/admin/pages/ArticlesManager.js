import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ArticleModal from '../components/ArticleModal';

function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await apiRequest('/api/admin/articles');
      setArticles(data);
    } catch (error) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await apiRequest(`/api/admin/articles/${id}`, { method: 'DELETE' });
      toast.success('Article deleted successfully');
      loadArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingArticle(null);
    loadArticles();
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
          <h2 className="text-2xl font-bold text-gray-900">Articles & Updates</h2>
          <p className="text-gray-600 mt-1">Manage blog posts and news updates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          data-testid="create-article-button"
          className="admin-btn admin-btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Article</span>
        </button>
      </div>

      <div className="admin-card">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title (EN)</th>
                  <th>Slug</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>
                      <img
                        src={article.thumbnail_url}
                        alt={article.title_en}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </td>
                    <td className="font-medium">{article.title_en}</td>
                    <td>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {article.slug}
                      </span>
                    </td>
                    <td>{new Date(article.published_date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          article.status ? 'admin-badge-success' : 'admin-badge-warning'
                        }`}
                      >
                        {article.status ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(article)}
                          data-testid={`edit-article-${article._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          data-testid={`delete-article-${article._id}`}
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
        <ArticleModal
          article={editingArticle}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ArticlesManager;