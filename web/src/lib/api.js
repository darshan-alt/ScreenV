// Helper for interacting with Express backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getHeaders = (hasFile = false) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('screenv1_token') : null;
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // If sending form-data (files), DO NOT set Content-Type header, let browser set it with boundary
  if (!hasFile) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const api = {
  // Auth
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to register');
    return result;
  },
  
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to login');
    return result;
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return await res.json();
  },

  // Videos
  getVideos: async () => {
    const res = await fetch(`${API_URL}/videos`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch videos');
    return await res.json();
  },

  getVideo: async (id) => {
    const res = await fetch(`${API_URL}/videos/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch video');
    return await res.json();
  },

  uploadVideo: async (formData) => {
    const res = await fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to upload video');
    return result;
  },

  deleteVideo: async (id) => {
    const res = await fetch(`${API_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete video');
    return result;
  },

  replaceVideo: async (id, formData) => {
    const res = await fetch(`${API_URL}/videos/${id}/replace`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to replace video');
    return result;
  }
};
