/* =============================================================
   config.js - Central Backend API Configuration
   ============================================================= */

'use strict';

// Production Render Backend URL
const DEFAULT_LIVE_BACKEND = 'https://student-management-system-2-8mc8.onrender.com';

window.API_BASE_URL = window.API_BASE_URL || DEFAULT_LIVE_BACKEND;

function getBackendBaseUrl() {
    // 1. Check window.API_BASE_URL if explicitly set
    if (window.API_BASE_URL && window.API_BASE_URL.trim() !== '') {
        return window.API_BASE_URL.trim().replace(/\/$/, '');
    }

    // 2. Check localStorage if user configured it in UI
    const savedUrl = localStorage.getItem('sms_backend_url');
    if (savedUrl && savedUrl.trim() !== '') {
        return savedUrl.trim().replace(/\/$/, '');
    }

    // 3. Fallback for Localhost development
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || !host) {
        return 'http://localhost:8080';
    }

    // 4. Default for production frontend without explicit backend URL
    return window.location.origin.replace(/\/$/, '');
}

function setBackendBaseUrl(url) {
    if (url) {
        localStorage.setItem('sms_backend_url', url.trim().replace(/\/$/, ''));
        window.API_BASE_URL = url.trim().replace(/\/$/, '');
    } else {
        localStorage.removeItem('sms_backend_url');
        window.API_BASE_URL = '';
    }
}

// Bind to window scope
window.getBackendBaseUrl = getBackendBaseUrl;
window.setBackendBaseUrl = setBackendBaseUrl;
