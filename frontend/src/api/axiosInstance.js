import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 (Unauthorized) due to expired token
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Logging out...");
      
      // 1. Remove invalid token
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); // If you store user data too

      // 2. Redirect to login page
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// Add Request Interceptor (to attach token)
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;