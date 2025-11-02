// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchCurriculum() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('curriculum-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/curriculum');
        
        if (!res.ok) {
            throw new Error('Failed to fetch curriculum');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(curriculum => {
            const row = document.createElement('tr');
            const teacherName = `${curriculum.FName || ''} ${curriculum.LName || ''}`.trim();
            const classInfo = `Sem ${curriculum.Sem || 'N/A'} - ${curriculum.Branch || 'N/A'} (${curriculum.Degree || 'N/A'})`;
            
            row.innerHTML = `
                <td>${classInfo}</td>
                <td><strong>${curriculum.CourseName || curriculum.CourseId || 'N/A'}</strong></td>
                <td>${curriculum.Credits || 'N/A'}</td>
                <td>${curriculum.DeptName || 'N/A'}</td>
                <td>${teacherName || 'N/A'}</td>
                <td>${curriculum.TeacherEmail || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading curriculum: ' + err.message);
    }
}

async function addCurriculum(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        classId: parseInt(form.classId.value),
        courseId: form.courseId.value.trim(),
        assignedTeacherId: parseInt(form.assignedTeacherId.value)
    };

    if (!payload.classId || !payload.courseId || !payload.assignedTeacherId) {
        showError('All fields are required');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const res = await fetch('/api/curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Curriculum saved successfully!');
            form.reset();
            fetchCurriculum();
        } else {
            showError(data.error || 'Error saving curriculum');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Curriculum';
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
    fetchCurriculum();
};

