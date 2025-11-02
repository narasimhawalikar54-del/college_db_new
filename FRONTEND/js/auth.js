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
        alert('Email and password are required.');
        return;
    }

    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.error || 'Sign in failed');
            return;
        }

        const data = await res.json();
        // store minimal user info for session; adapt to use token if you add JWT later
        localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
        window.location.href = '/courses.html';
    } catch (err) {
        console.error(err);
        alert('Error during sign in');
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value?.trim();
    const email = document.getElementById('signup-email')?.value?.trim();
    const password = document.getElementById('signup-password')?.value;

    if (!name || !email || !password) {
        alert('Name, email and password are required.');
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (res.status === 201 || res.ok) {
            alert('Signup successful — you can now sign in.');
            // switch to sign-in form if present
            document.getElementById('sign-up-form')?.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('sign-in-form')?.style && showSignIn && showSignIn();
            return;
        }

        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Signup failed');
    } catch (err) {
        console.error(err);
        alert('Error during signup');
    }
}

// ensure these functions exist globally for inline onclick usage in auth.html
function showSignUp() {
    const signInForm = document.getElementById('sign-in-form');
    const signUpForm = document.getElementById('sign-up-form');
    const title = document.getElementById('form-title');
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'block';
    if (title) title.textContent = 'Sign Up';
}

function showSignIn() {
    const signInForm = document.getElementById('sign-in-form');
    const signUpForm = document.getElementById('sign-up-form');
    const title = document.getElementById('form-title');
    if (signUpForm) signUpForm.style.display = 'none';
    if (signInForm) signInForm.style.display = 'block';
    if (title) title.textContent = 'Sign In';
}

// expose to global window so inline onclick can call them
window.showSignUp = showSignUp;
window.showSignIn = showSignIn;
