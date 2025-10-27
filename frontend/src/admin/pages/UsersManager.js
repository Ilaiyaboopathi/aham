import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import UserModal from '../components/UserModal';

function UsersManager({ user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiRequest('/api/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' });
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    loadUsers();
  };

  const isAdmin = currentUser?.role === 'admin';

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
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage admin users and roles</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            data-testid="create-user-button"
            className="admin-btn admin-btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add User</span>
          </button>
        )}
      </div>

      <div className="admin-card">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Last Login</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          user.role === 'admin'
                            ? 'admin-badge-danger'
                            : user.role === 'editor'
                            ? 'admin-badge-success'
                            : 'admin-badge-warning'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : 'Never'}
                    </td>
                    {isAdmin && (
                      <td>
                        {user.email !== currentUser.email && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            data-testid={`delete-user-${user._id}`}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <UserModal onClose={handleModalClose} />}
    </div>
  );
}

export default UsersManager;