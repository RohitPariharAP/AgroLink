// client/src/api/products.js
import API from './axios';

export const fetchProducts = async (category = '') => {
  const url = category ? `/products?category=${category}` : '/products';
  const response = await API.get(url);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await API.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProductAPI = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};