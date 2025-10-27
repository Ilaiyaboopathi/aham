import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductModal from '../components/ProductModal';

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiRequest('/api/admin/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    loadProducts();
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
          <h2 className="text-2xl font-bold text-gray-900">Loan Products</h2>
          <p className="text-gray-600 mt-1">Manage loan products and services</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          data-testid="create-product-button"
          className="admin-btn admin-btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="admin-card">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title (EN)</th>
                  <th>Description (EN)</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.title_en}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </td>
                    <td className="font-medium">{product.title_en}</td>
                    <td className="max-w-xs truncate">{product.description_en}</td>
                    <td>{product.order_index}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          product.status ? 'admin-badge-success' : 'admin-badge-warning'
                        }`}
                      >
                        {product.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          data-testid={`edit-product-${product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          data-testid={`delete-product-${product._id}`}
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
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ProductsManager;