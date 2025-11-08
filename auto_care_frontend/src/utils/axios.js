import axios from 'axios';

// Define your backend's base URL
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THIS IS THE CRITICAL FIX ---
// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    let token = null;

    // --- NEW ROBUST TOKEN LOGIC ---

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
        // We don't log an error, because the user object might not be JSON
      }
    }

    // 2. If that fails, try to get a token directly (based on your paste)
    if (!token) {
      token = localStorage.getItem('token'); // Check for a key 'token'
    }
    
    // 3. If that fails, try 'userToken'
    if (!token) {
      token = localStorage.getItem('userToken'); // Check for 'userToken'
    }

    // 4. If we found a token in any of those places, use it
    if (token) {
      // --- ADDED DEBUGGING ---
      console.log("✅ Axios Interceptor: Token found. Attaching to request.");
      // --- END DEBUGGING ---

      // Ensure the "Bearer " prefix is there, but not duplicated
      if (token.startsWith('Bearer ')) {
        config.headers['Authorization'] = token;
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      // --- ADDED DEBUGGING ---
      console.log("❌ Axios Interceptor: No token found in localStorage. Request will be unauthorized.");
      // --- END DEBUGGING ---
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;