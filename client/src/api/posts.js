// client/src/api/posts.js
import API from './axios';

export const fetchPosts = async () => {
  const response = await API.get('/posts');
  return response.data;
};

// Update this to accept FormData
export const createPost = async (formData) => {
  const response = await API.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


// Add these to client/src/api/posts.js

export const getPostById = async (id) => {
  const response = await API.get(`/posts/${id}`);
  return response.data; // Returns { post, comments }
};

export const deletePostAPI = async (id) => {
  const response = await API.delete(`/posts/${id}`);
  return response.data;
};

export const toggleLikeAPI = async (id) => {
  const response = await API.put(`/posts/${id}/like`);
  return response.data; // Returns the new array of upvotes
};

export const addComment = async (postId, commentData) => {
  const response = await API.post(`/posts/${postId}/comments`, commentData);
  return response.data;
};