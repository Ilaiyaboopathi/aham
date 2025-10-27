import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { setToken } from '../utils/auth';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setToken(data.access_token);
      onLogin(data.user);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">AHAM Housing Finance CMS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                data-testid="admin-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@ahamhfc.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                data-testid="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              data-testid="admin-login-button"
              disabled={loading}
              className="w-full admin-btn admin-btn-primary py-3 text-base font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Default Credentials:</strong><br />
              Email: admin@ahamhfc.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;