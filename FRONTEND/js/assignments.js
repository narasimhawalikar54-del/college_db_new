// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchAssignments() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('assignment-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/assignments');
        
        if (!res.ok) {
            throw new Error('Failed to fetch assignments');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(assignment => {
            const row = document.createElement('tr');
            const givenOn = new Date(assignment.GivenOn).toLocaleDateString();
            const deadline = new Date(assignment.Deadline).toLocaleDateString();
            const isOverdue = new Date(assignment.Deadline) < new Date();
            const deadlineClass = isOverdue ? 'deadline-overdue' : '';
            
            row.innerHTML = `
                <td><strong>${assignment.AssignmentId || 'N/A'}</strong></td>
                <td>${assignment.Title || 'N/A'}</td>
                <td>${assignment.CourseName || assignment.CourseId || 'N/A'}</td>
                <td>Sem ${assignment.Sem || 'N/A'} - ${assignment.Branch || 'N/A'}</td>
                <td>${givenOn}</td>
                <td class="${deadlineClass}">${deadline}</td>
                <td>${assignment.Description ? assignment.Description.substring(0, 50) + '...' : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading assignments: ' + err.message);
    }
}

async function addAssignment(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        givenOn: form.givenOn.value,
        deadline: form.deadline.value,
        classId: parseInt(form.classId.value),
        courseId: form.courseId.value.trim()
    };

    if (!payload.title || !payload.description || !payload.givenOn || !payload.deadline || !payload.classId || !payload.courseId) {
        showError('All fields are required');
        return;
    }

    if (new Date(payload.deadline) < new Date(payload.givenOn)) {
        showError('Deadline must be after given date');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Assignment added successfully!');
            form.reset();
            fetchAssignments();
        } else {
            showError(data.error || 'Error adding assignment');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Assignment';
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
    fetchAssignments();
};

