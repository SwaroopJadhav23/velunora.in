const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Local → Express on :5000 | Production → same-origin (/api via Vercel rewrite)
const defaultBackend = isLocalhost ? 'http://localhost:5000' : '';

const rawApiUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? defaultBackend;
export const API_BASE_URL = String(rawApiUrl).replace(/\/+$/, '');


export const WHATSAPP_NUMBER = '917758067739';
export const WHATSAPP_DISPLAY_NUMBER = '+91 77580 67739';



export interface ProductData {
  id?: number;
  slug?: string;
  name: string;
  universe: string;
  price: number;
  originalPrice?: number | null;
  isSpecialOffer?: boolean;
  discountPercentage?: number | null;
  badge?: string;
  description: string;
  floatingDecos?: string[] | string;
}

export interface SectionImageConfig {
  sectionName: string;
  key: string;
  imageUrl: string;
  label?: string;
  extra?: any;
}

export interface CouponData {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minPurchase: number;
  isActive: boolean;
  expiryDate?: string | null;
}

// Helper to make API requests
async function apiRequest(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api${path}`, options);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Request to ${path} failed:`, error);
    throw error;
  }
}

// ---------------- PRODUCTS ----------------
export const fetchProducts = () => apiRequest('/products');
export const fetchProduct = (slug: string) => apiRequest(`/products/${slug}`);

export const saveProduct = async (formData: FormData, id?: number) => {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/products/${id}` : '/products';
  
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    method,
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to save product`);
  }
  return response.json();
};

export const deleteProduct = (id: number) => 
  apiRequest(`/products/${id}`, { method: 'DELETE' });

// ---------------- SECTIONS ----------------
export const fetchSections = () => apiRequest('/sections');

export const saveSection = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/sections`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to save section image`);
  }
  return response.json();
};

export const deleteSection = (sectionName: string, key: string) => 
  apiRequest(`/sections/${sectionName}/${key}`, { method: 'DELETE' });

// ---------------- COUPONS ----------------
export const fetchCoupons = () => apiRequest('/coupons');

export const saveCoupon = (coupon: CouponData) => 
  apiRequest('/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon),
  });

export const deleteCoupon = (id: string) => 
  apiRequest(`/coupons/${id}`, { method: 'DELETE' });

export const validateCoupon = (code: string, totalAmount: number) => 
  apiRequest('/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, totalAmount }),
  });

// ---------------- ANALYTICS ----------------
export const logPageVisit = (path: string) => {
  return fetch(`${API_BASE_URL}/api/analytics/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path,
      userAgent: navigator.userAgent
    })
  }).catch(err => console.warn('Analytics tracking error:', err));
};

export const logProductClick = (productSlug: string, productName: string) => {
  return fetch(`${API_BASE_URL}/api/analytics/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productSlug,
      productName,
      userAgent: navigator.userAgent
    })
  }).catch(err => console.warn('Analytics tracking error:', err));
};

export const fetchAnalytics = () => apiRequest('/analytics');

// ---------------- SECURITY ----------------
export const fetchSecuritySettings = () => apiRequest('/security');
export const loginAdmin = (credentials: { pin?: string; username?: string; password?: string }) =>
  apiRequest('/security/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
export const updateSecuritySettings = (credentials: { pin?: string; username?: string; password?: string }) =>
  apiRequest('/security/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
