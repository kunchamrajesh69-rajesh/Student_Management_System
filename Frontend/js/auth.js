/* =============================================================
   auth.js  -  Session Management & Authentication Handler
   ============================================================= */

'use strict';

const SESSION_KEY = 'sms_session';

function getAuthEndpoint() {
    const HOST = window.location.hostname || 'localhost';
    return `http://${HOST}:8080/api/auth/login`;
}

/* ---------- SESSION HELPERS ---------------------------------- */

function startSession(username) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        username: username,
        loginTime: new Date().toISOString()
    }));
}

function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}

function requireLogin() {
    if (!getSession()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/* ---------- SHARED UI HELPERS -------------------------------- */

function getInitials(name) {
    return String(name || '')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text === undefined || text === null ? '' : text;
    return div.innerHTML;
}

function showAlert(message, type = 'info') {
    const holder = document.getElementById('alertArea');
    if (!holder) return;

    const iconMap = {
        success: 'bi-check-circle-fill',
        danger: 'bi-exclamation-triangle-fill',
        warning: 'bi-exclamation-circle-fill',
        info: 'bi-info-circle-fill'
    };
    const icon = iconMap[type] || 'bi-info-circle-fill';

    holder.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm border-0" role="alert">
            <i class="bi ${icon} fs-5"></i>
            <div>${escapeHtml(message)}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    setTimeout(function () {
        if (holder.firstChild) {
            holder.innerHTML = '';
        }
    }, 5000);
}

function paintSessionInfo() {
    const session = getSession();
    if (!session) return;

    document.querySelectorAll('[data-session-user]').forEach(function (el) {
        el.textContent = session.username;
    });

    document.querySelectorAll('[data-session-avatar]').forEach(function (el) {
        el.textContent = getInitials(session.username);
    });
}

/* ---------- LOGIN FORM --------------------------------------- */

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorBox = document.getElementById('loginError');

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        errorBox.classList.add('d-none');

        if (!username || !password) {
            errorBox.textContent = 'Please enter both username and password.';
            errorBox.classList.remove('d-none');
            return;
        }

        try {
            const response = await fetch(getAuthEndpoint(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                startSession(data.username || username);
                window.location.href = 'dashboard.html';
            } else {
                errorBox.textContent = data.message || 'Invalid administrator credentials. Try admin / admin123.';
                errorBox.classList.remove('d-none');
            }
        } catch (err) {
            console.error('Login connection error:', err);
            errorBox.textContent = 'Cannot reach backend server. Please verify Spring Boot API is running.';
            errorBox.classList.remove('d-none');
        }
    });
}

// Bind functions to window scope for inline HTML handlers
window.startSession = startSession;
window.getSession = getSession;
window.logout = logout;
window.requireLogin = requireLogin;
window.getInitials = getInitials;
window.escapeHtml = escapeHtml;
window.showAlert = showAlert;
window.paintSessionInfo = paintSessionInfo;

document.addEventListener('DOMContentLoaded', initLoginForm);
