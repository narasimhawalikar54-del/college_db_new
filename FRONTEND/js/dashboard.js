// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

// Get user info and display
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
}

