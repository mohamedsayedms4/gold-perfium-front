/**
 * Gold Perfium - Cart Management
 * Handles shopping cart operations and local storage
 */

class CartManager {
    constructor() {
        this.cart = this.loadCart();
    }

    /**
     * Load cart from localStorage
     * @returns {Array} Cart items
     */
    loadCart() {
        const cartJSON = localStorage.getItem(APP_CONFIG.cartStorageKey);
        return cartJSON ? JSON.parse(cartJSON) : [];
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem(APP_CONFIG.cartStorageKey, JSON.stringify(this.cart));
    }

    /**
     * Add item to cart
     * @param {object} product - Product to add
     * @param {number} quantity - Quantity to add
     */
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                product: product,
                quantity: quantity,
                unitPrice: product.price || 0,
            });
        }

        this.saveCart();
        return this.cart;
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     */
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.product.id !== productId);
        this.saveCart();
        return this.cart;
    }

    /**
     * Update item quantity
     * @param {number} productId - Product ID
     * @param {number} change - Quantity change (can be negative)
     */
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.product.id === productId);

        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }

        return this.cart;
    }

    /**
     * Get cart total
     * @returns {number} Total price
     */
    getTotal() {
        return this.cart.reduce((sum, item) => {
            return sum + ((item.unitPrice || 0) * item.quantity);
        }, 0);
    }

    /**
     * Get total items count
     * @returns {number} Total items
     */
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        return this.cart;
    }

    /**
     * Get cart items
     * @returns {Array} Cart items
     */
    getItems() {
        return this.cart;
    }

    /**
     * Check if cart is empty
     * @returns {boolean} True if empty
     */
    isEmpty() {
        return this.cart.length === 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
