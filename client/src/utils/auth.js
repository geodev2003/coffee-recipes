// Token management
export const getAuthToken = () => {
  return localStorage.getItem('brewvibe_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('brewvibe_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('brewvibe_token');
};

// User data management
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('brewvibe_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('brewvibe_user', JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('brewvibe_user');
};

