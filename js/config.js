/**
 * Gold Perfium - API Configuration
 * Central configuration file for all API endpoints and constants
 */

// API Base URL
const API_BASE_URL = 'https://api.gold-perfumes.com/api';

// Public API Endpoints (No Authentication Required)
const API_ENDPOINTS = {
    // Categories
    categories: `${API_BASE_URL}/categories`,
    
    // Products
    products: `${API_BASE_URL}/products/active`,
    productsByCategory: `${API_BASE_URL}/products/category`,
    productSearch: `${API_BASE_URL}/products/search`,
    
    // Orders
    orders: `${API_BASE_URL}/orders`,
    
    // Admin Info (Public)
    adminInfo: `${API_BASE_URL}/admin/info`,
};

// Admin API Endpoints (Authentication Required)
const ADMIN_ENDPOINTS = {
    categories: `${API_BASE_URL}/admin/categories`,
    products: `${API_BASE_URL}/admin/products`,
    orders: `${API_BASE_URL}/admin/orders`,
    storeInfo: `${API_BASE_URL}/admin/store-info`,
};

// Placeholder Image URLs
const PLACEHOLDER_IMAGES = {
    product: 'https://placehold.co/300x200/d4af37/ffffff?text=منتج',
    category: 'https://placehold.co/200x200/d4af37/ffffff?text=فئة',
    logo: 'https://placehold.co/60x60/d4af37/ffffff?text=شعار',
    noImage: 'https://placehold.co/300x200/cccccc/ffffff?text=لا+توجد+صورة',
};

// Application Constants
const APP_CONFIG = {
    // Pagination
    defaultPageSize: 20,
    maxPageSize: 100,
    
    // Cart
    cartStorageKey: 'cart',
    
    // Auth
    authTokenKey: 'authToken',
    usernameKey: 'username',
    
    // Theme
    darkModeKey: 'darkMode',
    
    // Order Status
    orderStatus: {
        NEW: 'NEW',
        PROCESSING: 'PROCESSING',
        SHIPPED: 'SHIPPED',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED',
    },
    
    // Image Upload
    maxImageSize: 5 * 1024 * 1024, // 5MB
    acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        API_ENDPOINTS,
        ADMIN_ENDPOINTS,
        PLACEHOLDER_IMAGES,
        APP_CONFIG,
    };
}
