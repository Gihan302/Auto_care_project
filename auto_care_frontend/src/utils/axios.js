import axios from 'axios';

// ✅ FIX: Point to your actual backend URL
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    let token = null;

    // 1. Try to get the full user object
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        // Look for the token inside the stored user object
        if (userData && userData.token) {
          token = userData.token;
        }
      } catch (e) {
        // Silent fail - user object might not be JSON
      }
    }

    // 2. If that fails, try to get a token directly
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    // 3. If that fails, try 'userToken'
    if (!token) {
      token = localStorage.getItem('userToken');
    }

    // 4. If we found a token, attach it
    if (token) {
      console.log("✅ Axios Interceptor: Token found. Attaching to request.");
      
      // Ensure the "Bearer " prefix is there, but not duplicated
      if (token.startsWith('Bearer ')) {
        config.headers['Authorization'] = token;
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      console.log("❌ Axios Interceptor: No token found in localStorage.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token might be invalid or expired');
      // Optionally redirect to login
      // window.location.href = '/signin';
    } else if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden - Access denied');
    } else if (error.response?.status === 404) {
      console.error('❌ 404 Not Found - Endpoint does not exist:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;