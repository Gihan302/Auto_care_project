// import axios from 'axios';

// // ✅ FIX: Point to your actual backend URL
// const API_BASE_URL = 'http://localhost:8080/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to attach the token to every request
// api.interceptors.request.use(
//   (config) => {
//     let token = null;
//     console.log("--- Axios Interceptor ---");

//     // 1. Try to get the full user object
//     const userString = localStorage.getItem('user');
//     console.log("1. userString:", userString);
//     if (userString) {
//       try {
//         const userData = JSON.parse(userString);
//         console.log("1a. userData:", userData);
//         // Look for the token inside the stored user object
//         if (userData && userData.token) {
//           token = userData.token;
//           console.log("1b. Token from userData:", token);
//         }
//       } catch (e) {
//         console.error("Error parsing userString:", e);
//       }
//     }

//     // 2. If that fails, try to get a token directly
//     if (!token) {
//       token = localStorage.getItem('token');
//       console.log("2. Token from localStorage.getItem('token'):", token);
//     }
    
//     // 3. If that fails, try 'userToken'
//     if (!token) {
//       token = localStorage.getItem('userToken');
//       console.log("3. Token from localStorage.getItem('userToken'):", token);
//     }

//     // 4. If we found a token, attach it
//     if (token) {
//       console.log("✅ Axios Interceptor: Token found. Attaching to request.");
      
//       // Ensure the "Bearer " prefix is there, but not duplicated
//       if (token.startsWith('Bearer ')) {
//         config.headers['Authorization'] = token;
//       } else {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//     } else {
//       console.log("❌ Axios Interceptor: No token found in localStorage.");
//     }
//     console.log("-------------------------");

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for better error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error('❌ 401 Unauthorized - Token might be invalid or expired');
//       // Optionally redirect to login
//       // window.location.href = '/signin';
//     } else if (error.response?.status === 403) {
//       console.error('❌ 403 Forbidden - Access denied');
//     } else if (error.response?.status === 404) {
//       console.error('❌ 404 Not Found - Endpoint does not exist:', error.config?.url);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

// ✅ CORRECT BASE URL (Includes /api)
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    let token = null;
    console.log("--- Axios Interceptor ---");

    // 1. Try to get the full user object from 'user', 'lcompany', or 'company'
    // (We check all three so this works for both Users and Companies)
    const userString = localStorage.getItem('user') || localStorage.getItem('lcompany') || localStorage.getItem('company');
    
    console.log("1. Checking storage for user/company data...");
    
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        // Look for the token inside the stored object
        if (userData && userData.token) {
          token = userData.token;
          console.log("   -> Token found in user object.");
        }
      } catch (e) {
        console.error("   -> Error parsing stored user JSON:", e);
      }
    }

    // 2. Fallback: Try to get a token directly
    if (!token) {
      token = localStorage.getItem('token');
      if (token) console.log("2. Token found in 'token' key.");
    }
    
    // 3. Fallback: Try 'userToken'
    if (!token) {
      token = localStorage.getItem('userToken');
      if (token) console.log("3. Token found in 'userToken' key.");
    }

    // 4. If we found a token, attach it
    if (token) {
      console.log("✅ Axios Interceptor: Token attached.");
      
      // Ensure the "Bearer " prefix is there, but not duplicated
      if (token.startsWith('Bearer ')) {
        config.headers['Authorization'] = token;
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      console.log("❌ Axios Interceptor: No token found. Request is anonymous.");
    }
    console.log("-------------------------");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token might be invalid or expired');
      // Optional: Redirect to login here
    } else if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden - Access denied (Role mismatch?)');
    } else if (error.response?.status === 404) {
      console.error('❌ 404 Not Found - Endpoint does not exist:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;