export const setToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const getToken = () => {
  return localStorage.getItem('admin_token');
};

export const removeToken = () => {
  localStorage.removeItem('admin_token');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};