import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

function AdminLayout({ children, user, onLogout }) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/admin/banners', label: 'Hero Banners', icon: PhotoIcon },
    { path: '/admin/products', label: 'Loan Products', icon: TagIcon },
    { path: '/admin/testimonials', label: 'Testimonials', icon: ChatBubbleLeftRightIcon },
    { path: '/admin/articles', label: 'Articles & Updates', icon: NewspaperIcon },
    { path: '/admin/media', label: 'Media Library', icon: DocumentTextIcon },
    { path: '/admin/users', label: 'User Management', icon: UsersIcon },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">AHAM CMS</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        {/* Top Bar */}
        <div className="admin-topbar flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              data-testid="user-menu-button"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={onLogout}
                  data-testid="logout-button"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;