// API Base URL configuration
// In production (Docker), nginx proxies /api to backend
// In development, use localhost:5000

const API_BASE_URL = import.meta.env.PROD
  ? '/api'  // Production: nginx proxies to backend
  : 'http://localhost:5000/api';  // Development: direct to backend

export default API_BASE_URL;
