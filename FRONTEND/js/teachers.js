// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchTeachers() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('teacher-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/teachers');
        
        if (!res.ok) {
            throw new Error('Failed to fetch teachers');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(teacher => {
            const row = document.createElement('tr');
            const fullName = `${teacher.FName || ''} ${teacher.MInit || ''} ${teacher.LName || ''}`.trim();
            
            row.innerHTML = `
                <td><strong>${teacher.UserId || 'N/A'}</strong></td>
                <td>${fullName || 'N/A'}</td>
                <td>${teacher.Email || 'N/A'}</td>
                <td>${teacher.Department || 'N/A'}</td>
                <td>${teacher.Salary ? '₹' + teacher.Salary.toLocaleString() : 'N/A'}</td>
                <td>${teacher.Phone || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading teachers: ' + err.message);
    }
}

async function addTeacher(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        userId: parseInt(form.userId.value),
        salary: parseFloat(form.salary.value),
        ssn: form.ssn.value.trim(),
        department: form.department.value.trim()
    };

    if (!payload.userId || !payload.salary || !payload.ssn || !payload.department) {
        showError('All fields are required');
        return;
    }

    if (payload.salary < 0) {
        showError('Salary must be positive');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/teachers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Teacher added successfully!');
            form.reset();
            fetchTeachers();
        } else {
            showError(data.error || 'Error adding teacher');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Teacher';
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
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
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
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

window.onload = function() {
    fetchTeachers();
};

