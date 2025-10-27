import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TestimonialModal from '../components/TestimonialModal';

function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await apiRequest('/api/admin/testimonials');
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await apiRequest(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      toast.success('Testimonial deleted successfully');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    loadTestimonials();
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
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage customer reviews and feedback</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          data-testid="create-testimonial-button"
          className="admin-btn admin-btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="admin-card">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Loan Type</th>
                  <th>Rating</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id}>
                    <td>
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="font-medium">{testimonial.name}</td>
                    <td>{testimonial.location}</td>
                    <td>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {testimonial.loan_type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{testimonial.rating}/5</span>
                      </div>
                    </td>
                    <td>{testimonial.order_index}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          testimonial.status ? 'admin-badge-success' : 'admin-badge-warning'
                        }`}
                      >
                        {testimonial.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          data-testid={`edit-testimonial-${testimonial._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          data-testid={`delete-testimonial-${testimonial._id}`}
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
        <TestimonialModal
          testimonial={editingTestimonial}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default TestimonialsManager;