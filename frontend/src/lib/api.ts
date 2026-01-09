import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // Send cookies (refresh token)
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  // We will attach the token from the context in the component or via a separate mechanism.
  // Ideally, we can't access React Context here easily.
  // Common pattern: Store token in local variable in this file or localStorage (if not using httpOnly).
  // But we use memory storage for security (Access Token).
  // So we might need a setAccessToken helper.
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    // If the failed request was already for refresh, don't retry it.
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.get('/auth/refresh');
      const { accessToken } = data;
      setAuthToken(accessToken);
      
      // Notify queue
      processQueue(null, accessToken);
      
      // Retry original
      originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // Logout logic handled by context usually?
      // We can emit an event or return error so Context handles it.
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
});

export default api;
