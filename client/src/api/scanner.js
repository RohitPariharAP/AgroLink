// client/src/api/scanner.js
import API from './axios';

export const analyzeCropImage = async (imageFile) => {
  // We must use FormData to send a physical file to the backend
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await API.post('/scanner/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};