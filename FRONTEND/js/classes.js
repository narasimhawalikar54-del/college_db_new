// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchClasses() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('class-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/classes');
        if (!res.ok) throw new Error('Failed to fetch classes');

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(cls => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${cls.ClassId || 'N/A'}</strong></td>
                <td>${cls.Sem || 'N/A'}</td>
                <td>${cls.Branch || 'N/A'}</td>
                <td>${cls.Degree || 'N/A'}</td>
                <td>${cls.StartDate || 'N/A'}</td>
                <td>${cls.EndDate || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading classes: ' + err.message);
    }
}

async function addClass(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        sem: parseInt(form.sem.value),
        branch: form.branch.value.trim(),
        degree: form.degree.value.trim(),
        startDate: form.startDate.value,
        endDate: form.endDate.value
    };

    if (new Date(payload.endDate) < new Date(payload.startDate)) {
        showError('End date must be after start date');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Class added successfully!');
            form.reset();
            fetchClasses();
        } else {
            showError(data.error || 'Error adding class');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Class';
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
}

function showError(message) {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'error-message';
        document.querySelector('.page-container').insertBefore(errorDiv, document.querySelector('.page-container').firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

function showSuccess(message) {
    let successDiv = document.getElementById('success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'success-message';
        successDiv.className = 'success-message';
        document.querySelector('.page-container').insertBefore(successDiv, document.querySelector('.page-container').firstChild);
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => successDiv.style.display = 'none', 3000);
}

window.onload = fetchClasses;

