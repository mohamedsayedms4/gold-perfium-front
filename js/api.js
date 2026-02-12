/**
 * Gold Perfium - API Service
 * Centralized API communication layer
 */

class APIService {
    /**
     * Fetch categories with pagination
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Categories response
     */
    static async getCategories(page = 0, size = 20) {
        try {
            const response = await fetch(`${API_ENDPOINTS.categories}?page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            return data.content || data._embedded?.categories || data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    /**
     * Fetch active products
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Products response
     */
    static async getProducts(page = 0, size = 20) {
        try {
            const response = await fetch(`${API_ENDPOINTS.products}?page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            return data.content || data._embedded?.products || data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    /**
     * Fetch products by category
     * @param {number} categoryId - Category ID
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Products response
     */
    static async getProductsByCategory(categoryId, page = 0, size = 100) {
        try {
            const response = await fetch(`${API_ENDPOINTS.productsByCategory}/${categoryId}?page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to fetch products by category');
            }

            const data = await response.json();
            return data.content || data._embedded?.products || data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }

    /**
     * Search products by keyword
     * @param {string} keyword - Search keyword
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Search results
     */
    static async searchProducts(keyword, page = 0, size = 10) {
        try {
            const response = await fetch(`${API_ENDPOINTS.productSearch}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to search products');
            }

            const data = await response.json();
            return data.content || data._embedded?.products || data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    /**
     * Create new order
     * @param {object} orderData - Order data
     * @returns {Promise<object>} Created order
     */
    static async createOrder(orderData) {
        try {
            const response = await fetch(API_ENDPOINTS.orders, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    /**
     * Fetch admin/store info
     * @returns {Promise<object>} Admin info
     */
    static async getAdminInfo() {
        try {
            const response = await fetch(API_ENDPOINTS.adminInfo);

            if (!response.ok) {
                throw new Error('Failed to fetch admin info');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching admin info:', error);
            throw error;
        }
    }

    // ============================================
    // ADMIN ENDPOINTS (Require Authentication)
    // ============================================

    /**
     * Fetch admin categories
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Categories response
     */
    static async getAdminCategories(page = 0, size = 20) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.categories}?page=${page}&size=${size}`);

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = 'login.html';
                }
                throw new Error('Failed to fetch admin categories');
            }

            const data = await response.json();
            return data.content || data._embedded?.categories || data;
        } catch (error) {
            console.error('Error fetching admin categories:', error);
            throw error;
        }
    }

    /**
     * Create new category
     * @param {object} categoryData - Category data
     * @returns {Promise<object>} Created category
     */
    static async createCategory(categoryData) {
        try {
            const response = await authenticatedFetch(ADMIN_ENDPOINTS.categories, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                throw new Error('Failed to create category');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    /**
     * Update category
     * @param {number} categoryId - Category ID
     * @param {object} categoryData - Updated category data
     * @returns {Promise<object>} Updated category
     */
    static async updateCategory(categoryId, categoryData) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.categories}/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    /**
     * Delete category
     * @param {number} categoryId - Category ID
     * @returns {Promise<void>}
     */
    static async deleteCategory(categoryId) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.categories}/${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    /**
     * Fetch admin products
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Products response
     */
    static async getAdminProducts(page = 0, size = 20) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.products}?page=${page}&size=${size}`);

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = 'login.html';
                }
                throw new Error('Failed to fetch admin products');
            }

            const data = await response.json();
            return data.content || data._embedded?.products || data;
        } catch (error) {
            console.error('Error fetching admin products:', error);
            throw error;
        }
    }

    /**
     * Create new product
     * @param {object} productData - Product data
     * @returns {Promise<object>} Created product
     */
    static async createProduct(productData) {
        try {
            const response = await authenticatedFetch(ADMIN_ENDPOINTS.products, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    /**
     * Update product
     * @param {number} productId - Product ID
     * @param {object} productData - Updated product data
     * @returns {Promise<object>} Updated product
     */
    static async updateProduct(productId, productData) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.products}/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    /**
     * Delete product
     * @param {number} productId - Product ID
     * @returns {Promise<void>}
     */
    static async deleteProduct(productId) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.products}/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    /**
     * Fetch admin orders
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<object>} Orders response
     */
    static async getAdminOrders(page = 0, size = 20) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.orders}?page=${page}&size=${size}`);

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = 'login.html';
                }
                throw new Error('Failed to fetch admin orders');
            }

            const data = await response.json();
            return data.content || data._embedded?.orders || data;
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            throw error;
        }
    }

    /**
     * Update order status
     * @param {number} orderId - Order ID
     * @param {object} orderData - Updated order data
     * @returns {Promise<object>} Updated order
     */
    static async updateOrder(orderId, orderData) {
        try {
            const response = await authenticatedFetch(`${ADMIN_ENDPOINTS.orders}/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
