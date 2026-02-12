/**
 * Gold Perfium - Utility Functions
 * Common utility functions used across the application
 */

/**
 * Build full image URL from relative path or return as-is if absolute
 * @param {string} imagePath - Image path from API
 * @returns {string} Full image URL
 */
function buildImageUrl(imagePath) {
    if (!imagePath) return PLACEHOLDER_IMAGES.noImage;

    // Already an absolute URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Relative path from API
    if (imagePath.startsWith('/') || imagePath.startsWith('uploads/')) {
        const baseUrl = 'https://api.gold-perfumes.com';
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }

    return imagePath;
}

/**
 * Initialize Dark Mode from localStorage
 */
function initDarkMode() {
    const isDarkMode = localStorage.getItem(APP_CONFIG.darkModeKey) === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    return isDarkMode;
}

/**
 * Toggle Dark Mode and save to localStorage
 * @returns {boolean} New dark mode state
 */
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem(APP_CONFIG.darkModeKey, isDarkMode);
    return isDarkMode;
}

/**
 * Format price in Egyptian Pounds
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    if (!price && price !== 0) return '0';
    return price.toLocaleString('ar-EG');
}

/**
 * Format date to Arabic locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Show loading indicator
 * @param {HTMLElement} element - Loading element to show
 */
function showLoading(element) {
    if (element) {
        element.classList.add('show');
    }
}

/**
 * Hide loading indicator
 * @param {HTMLElement} element - Loading element to hide
 */
function hideLoading(element) {
    if (element) {
        element.classList.remove('show');
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 * @param {HTMLElement} element - Element to show error in
 */
function showError(message, element) {
    if (element) {
        element.textContent = message;
        element.classList.add('show');

        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    } else {
        alert(message);
    }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} Auth token or null
 */
function getAuthToken() {
    return localStorage.getItem(APP_CONFIG.authTokenKey);
}

/**
 * Save authentication token to localStorage
 * @param {string} token - Auth token to save
 * @param {string} username - Username to save
 */
function saveAuthToken(token, username) {
    localStorage.setItem(APP_CONFIG.authTokenKey, token);
    localStorage.setItem(APP_CONFIG.usernameKey, username);
}

/**
 * Clear authentication data from localStorage
 */
function clearAuthToken() {
    localStorage.removeItem(APP_CONFIG.authTokenKey);
    localStorage.removeItem(APP_CONFIG.usernameKey);
}

/**
 * Make authenticated API request
 * @param {string} url - API URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
async function authenticatedFetch(url, options = {}) {
    const token = getAuthToken();

    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Basic ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Egyptian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
function isValidPhone(phone) {
    const phoneRegex = /^(01)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Create image with error fallback
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} fallbackSrc - Fallback image URL
 * @returns {HTMLImageElement} Image element
 */
function createImageWithFallback(src, alt, fallbackSrc) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    img.onerror = function () {
        this.onerror = null; // Prevent infinite loop
        this.src = fallbackSrc || PLACEHOLDER_IMAGES.noImage;
    };

    return img;
}

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Element or selector to scroll to
 */
function smoothScrollTo(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buildImageUrl,
        initDarkMode,
        toggleDarkMode,
        formatPrice,
        formatDate,
        showLoading,
        hideLoading,
        showError,
        getAuthToken,
        saveAuthToken,
        clearAuthToken,
        authenticatedFetch,
        debounce,
        throttle,
        isValidEmail,
        isValidPhone,
        sanitizeHTML,
        createImageWithFallback,
        smoothScrollTo,
        copyToClipboard,
        generateUniqueId,
        isInViewport,
    };
}
