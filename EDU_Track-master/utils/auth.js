// utils/auth.js

// Get token from sessionStorage
export const getToken = () => {
  return sessionStorage.getItem('token');
};

// Set token in sessionStorage
export const setToken = (token) => {
  sessionStorage.setItem('token', token);
};

// Remove token from sessionStorage
export const removeData = () => {
  sessionStorage.removeItem('userData');
};

// Check if the user is authenticated (i.e., token exists in sessionStorage)
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
