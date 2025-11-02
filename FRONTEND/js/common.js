// Common utility functions for all pages

// Check authentication
function checkAuth() {
    if (!localStorage.getItem('authToken')) {
        window.location.href = '/auth.html';
        return false;
    }
    return true;
}

// Get user info and display
function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && user.name) {
        userNameEl.textContent = `Welcome, ${user.name}`;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
}

// Show error message
function showError(message, container = '.page-container') {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'error-message';
        const target = document.querySelector(container);
        if (target) {
            target.insertBefore(errorDiv, target.firstChild);
        }
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// Show success message
function showSuccess(message, container = '.page-container') {
    let successDiv = document.getElementById('success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'success-message';
        successDiv.className = 'success-message';
        const target = document.querySelector(container);
        if (target) {
            target.insertBefore(successDiv, target.firstChild);
        }
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => successDiv.style.display = 'none', 3000);
}

// Initialize page
function initPage() {
    if (!checkAuth()) return;
    displayUserInfo();
}

