document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('sign-in-form');
    const signUpForm = document.getElementById('sign-up-form');

    if (signInForm) signInForm.addEventListener('submit', handleSignIn);
    if (signUpForm) signUpForm.addEventListener('submit', handleSignUp);
});

async function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email')?.value?.trim();
    const password = document.getElementById('signin-password')?.value;

    if (!email || !password) {
        showError('Email and password are required.');
        return;
    }

    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json(); // Always parse JSON

        if (!res.ok) {
            showError(data.error || 'Sign in failed');
            return;
        }

        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard.html';

    } catch (err) {
        console.error(err);
        showError('Error during sign in. See console for details.');
    }
}

async function handleSignUp(e) {
    e.preventDefault();

    // Collect all fields from the signup form
    const payload = {
        fName: document.getElementById('signup-fname')?.value?.trim(),
        mInit: document.getElementById('signup-minit')?.value?.trim(),
        lName: document.getElementById('signup-lname')?.value?.trim(),
        email: document.getElementById('signup-email')?.value?.trim(),
        password: document.getElementById('signup-password')?.value,
        role: document.getElementById('signup-role')?.value,
        phone: document.getElementById('signup-phone')?.value?.trim(),
        state: document.getElementById('signup-state')?.value?.trim(),
        city: document.getElementById('signup-city')?.value?.trim(),
        pinCode: document.getElementById('signup-pincode')?.value?.trim(),
        dob: document.getElementById('signup-dob')?.value
    };

    // Simple validation
    if (!payload.fName || !payload.lName || !payload.email || !payload.password || !payload.role || !payload.phone || !payload.state || !payload.city || !payload.pinCode || !payload.dob) {
        showError('All fields marked with * are required.');
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) // Send the full payload
        });

        const data = await res.json(); // Always parse JSON

        if (res.status === 201 || res.ok) {
            showSuccess('Signup successful! Please sign in.');
            document.getElementById('sign-up-form')?.reset();
            showSignIn(); // Switch to sign-in form
            return;
        }

        showError(data.error || 'Signup failed');

    } catch (err) {
        console.error(err);
        showError('Error during signup. See console for details.');
    }
}

// Global functions for inline onclick
function showSignUp() {
    document.getElementById('sign-in-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sign Up';
    document.getElementById('form-subtitle').textContent = 'Create your account to get started.';
    clearMessages();
}

function showSignIn() {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('sign-in-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sign In';
    document.getElementById('form-subtitle').textContent = 'Welcome back! Please sign in to continue.';
    clearMessages();
}

function clearMessages() {
    const error = document.getElementById('error-message');
    const success = document.getElementById('success-message');
    if (error) error.style.display = 'none';
    if (success) success.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message); // Fallback
    }
    const successDiv = document.getElementById('success-message');
    if (successDiv) successDiv.style.display = 'none';
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    } else {
        alert(message); // Fallback
    }
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.style.display = 'none';
}

// Expose to global window so inline onclick can call them
window.showSignUp = showSignUp;
window.showSignIn = showSignIn;