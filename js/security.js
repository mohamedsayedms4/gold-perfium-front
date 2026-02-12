/**
 * Gold Perfium - Security Utilities
 * Enhanced security functions for XSS protection, input sanitization, and secure storage
 */

/**
 * Comprehensive HTML sanitization to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    // Create a temporary div element
    const div = document.createElement('div');
    div.textContent = input;

    // Additional sanitization for common XSS patterns
    return div.innerHTML
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

/**
 * Sanitize object with multiple properties
 * @param {object} obj - Object to sanitize
 * @param {Array<string>} fields - Fields to sanitize
 * @returns {object} Sanitized object
 */
function sanitizeObject(obj, fields) {
    const sanitized = { ...obj };

    fields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = sanitizeInput(sanitized[field]);
        }
    });

    return sanitized;
}

/**
 * Validate and sanitize email
 * @param {string} email - Email to validate
 * @returns {string|null} Sanitized email or null if invalid
 */
function sanitizeEmail(email) {
    const sanitized = sanitizeInput(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Validate and sanitize phone number (Egyptian format)
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Sanitized phone or null if invalid
 */
function sanitizePhone(phone) {
    const sanitized = sanitizeInput(phone).replace(/\s/g, '');
    const phoneRegex = /^(01)[0-9]{9}$/;

    return phoneRegex.test(sanitized) ? sanitized : null;
}

/**
 * Simple encryption for localStorage (Base64 + obfuscation)
 * NOTE: This is NOT cryptographically secure, just obscures data from casual inspection
 * For true security, use HTTPS and secure backend authentication
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
function encryptData(data) {
    try {
        // Add salt and encode
        const salt = 'GP_' + Date.now().toString(36);
        const combined = salt + '|' + data;

        // Base64 encode
        const encoded = btoa(unescape(encodeURIComponent(combined)));

        // Simple obfuscation - reverse and add padding
        return encoded.split('').reverse().join('') + '_GP';
    } catch (error) {
        console.error('Encryption error:', error);
        return data; // Fallback to unencrypted
    }
}

/**
 * Decrypt data from localStorage
 * @param {string} encryptedData - Encrypted data
 * @returns {string} Decrypted data
 */
function decryptData(encryptedData) {
    try {
        // Remove padding and reverse
        const withoutPadding = encryptedData.replace(/_GP$/, '');
        const reversed = withoutPadding.split('').reverse().join('');

        // Base64 decode
        const decoded = decodeURIComponent(escape(atob(reversed)));

        // Remove salt
        const parts = decoded.split('|');
        return parts.length > 1 ? parts.slice(1).join('|') : decoded;
    } catch (error) {
        console.error('Decryption error:', error);
        return encryptedData; // Fallback to returning as-is
    }
}

/**
 * Securely store data in localStorage with encryption
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
function secureSetItem(key, value) {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        const encrypted = encryptData(stringValue);
        localStorage.setItem(key, encrypted);
    } catch (error) {
        console.error('Secure storage error:', error);
    }
}

/**
 * Retrieve and decrypt data from localStorage
 * @param {string} key - Storage key
 * @param {boolean} parseJSON - Whether to parse as JSON
 * @returns {any} Decrypted value
 */
function secureGetItem(key, parseJSON = false) {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;

        const decrypted = decryptData(encrypted);

        return parseJSON ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
        console.error('Secure retrieval error:', error);
        return null;
    }
}

/**
 * Securely remove item from localStorage
 * @param {string} key - Storage key
 */
function secureRemoveItem(key) {
    localStorage.removeItem(key);
}

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session
 */
function initializeCSRFToken() {
    let token = sessionStorage.getItem('csrf_token');

    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem('csrf_token', token);
    }

    return token;
}

/**
 * Get CSRF token
 * @returns {string} CSRF token
 */
function getCSRFToken() {
    return sessionStorage.getItem('csrf_token') || initializeCSRFToken();
}

/**
 * Add CSRF token to form data
 * @param {FormData|object} data - Form data
 * @returns {FormData|object} Data with CSRF token
 */
function addCSRFToken(data) {
    const token = getCSRFToken();

    if (data instanceof FormData) {
        data.append('csrf_token', token);
    } else if (typeof data === 'object') {
        data.csrf_token = token;
    }

    return data;
}

/**
 * Validate URL to prevent open redirect attacks
 * @param {string} url - URL to validate
 * @param {Array<string>} allowedDomains - Allowed domains
 * @returns {boolean} True if URL is safe
 */
function isValidURL(url, allowedDomains = ['gold-perfumes.com']) {
    try {
        const urlObj = new URL(url);

        // Check if domain is in allowed list
        return allowedDomains.some(domain =>
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
    } catch (error) {
        // Invalid URL format
        return false;
    }
}

/**
 * Rate limiting for API calls (client-side)
 * @param {string} key - Rate limit key
 * @param {number} maxAttempts - Max attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if within rate limit
 */
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const rateLimitKey = `rate_limit_${key}`;

    let attempts = JSON.parse(sessionStorage.getItem(rateLimitKey) || '[]');

    // Remove old attempts outside window
    attempts = attempts.filter(timestamp => now - timestamp < windowMs);

    // Check if exceeded
    if (attempts.length >= maxAttempts) {
        return false;
    }

    // Add current attempt
    attempts.push(now);
    sessionStorage.setItem(rateLimitKey, JSON.stringify(attempts));

    return true;
}

/**
 * Clear rate limit for a key
 * @param {string} key - Rate limit key
 */
function clearRateLimit(key) {
    sessionStorage.removeItem(`rate_limit_${key}`);
}

/**
 * Validate file upload (type and size)
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @param {number} maxSizeBytes - Max file size in bytes
 * @returns {object} Validation result {valid, error}
 */
function validateFileUpload(file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'], maxSizeBytes = 5 * 1024 * 1024) {
    if (!file) {
        return { valid: false, error: 'لم يتم اختيار ملف' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'نوع الملف غير مسموح به' };
    }

    if (file.size > maxSizeBytes) {
        const maxMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        return { valid: false, error: `حجم الملف يجب أن يكون أقل من ${maxMB} ميجابايت` };
    }

    return { valid: true, error: null };
}

/**
 * Escape special characters in regex
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Content Security Policy - Generate nonce for inline scripts
 * @returns {string} Random nonce
 */
function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
}

/**
 * Remove all event handlers from user-generated content
 * @param {string} html - HTML string
 * @returns {string} Cleaned HTML
 */
function stripEventHandlers(html) {
    return html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
}

/**
 * Prevent timing attacks by using constant-time comparison
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings match
 */
function constantTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput,
        sanitizeObject,
        sanitizeEmail,
        sanitizePhone,
        encryptData,
        decryptData,
        secureSetItem,
        secureGetItem,
        secureRemoveItem,
        generateCSRFToken,
        initializeCSRFToken,
        getCSRFToken,
        addCSRFToken,
        isValidURL,
        checkRateLimit,
        clearRateLimit,
        validateFileUpload,
        escapeRegex,
        generateNonce,
        stripEventHandlers,
        constantTimeEqual,
    };
}
