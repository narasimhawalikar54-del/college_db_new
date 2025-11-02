// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchStudents() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('student-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/students');
        
        if (!res.ok) {
            throw new Error('Failed to fetch students');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(student => {
            const row = document.createElement('tr');
            const fullName = `${student.FName || ''} ${student.MInit || ''} ${student.LName || ''}`.trim();
            const classInfo = student.Sem && student.Branch ? 
                `Sem ${student.Sem} - ${student.Branch}` : 'Not Assigned';
            
            row.innerHTML = `
                <td><strong>${student.UserId || 'N/A'}</strong></td>
                <td>${fullName || 'N/A'}</td>
                <td>${student.Email || 'N/A'}</td>
                <td>${student.Phone || 'N/A'}</td>
                <td>${student.DOB || 'N/A'}</td>
                <td>${classInfo}</td>
                <td>
                    <button onclick="editStudent(${student.UserId})" class="btn-edit">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading students: ' + err.message);
    }
}

async function addStudent(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        userId: parseInt(form.userId.value),
        currentClassId: form.currentClassId.value ? parseInt(form.currentClassId.value) : null
    };

    if (!payload.userId) {
        showError('User ID is required');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Student added successfully!');
            form.reset();
            fetchStudents();
        } else {
            showError(data.error || 'Error adding student');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Student';
    }
}

async function editStudent(userId) {
    const classId = prompt('Enter new Class ID (or leave empty to remove):');
    if (classId === null) return;

    try {
        const res = await fetch(`/api/students/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentClassId: classId ? parseInt(classId) : null })
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Student updated successfully!');
            fetchStudents();
        } else {
            showError(data.error || 'Error updating student');
        }
    } catch (err) {
        showError('Error: ' + err.message);
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
    fetchStudents();
};

