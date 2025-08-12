import axios from 'axios';

const API = axios.create({
  baseURL: 'https://your-django-backend.onrender.com',
});

export const login = (username, password) =>
  API.post('/api/token/', { username, password });

export const getProfile = (token) =>
  API.get('/profile/', {
    headers: { Authorization: `Bearer ${token}` }
  });
