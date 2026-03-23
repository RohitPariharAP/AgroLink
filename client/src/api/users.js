import API from './axios';

export const fetchUserProfile = async (userId) => {
  const response = await API.get(`/users/${userId}`);
  return response.data;
};

// NEW FUNCTION
export const updateUserProfile = async (formData) => {
  // We must use multipart/form-data so Express knows it's receiving a file
  const response = await API.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};