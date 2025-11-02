// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchAttendance() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('attendance-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/attendance');
        
        if (!res.ok) {
            throw new Error('Failed to fetch attendance records');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(record => {
            const row = document.createElement('tr');
            const studentName = `${record.FName || ''} ${record.LName || ''}`.trim();
            const date = record.Date ? new Date(record.Date).toLocaleDateString() : 'N/A';
            const statusClass = record.Status === 'Present' ? 'status-present' : 
                               record.Status === 'Absent' ? 'status-absent' : 'status-partial';
            
            row.innerHTML = `
                <td>${studentName || 'N/A'}</td>
                <td>${record.Email || 'N/A'}</td>
                <td>${date}</td>
                <td>${record.Time || 'N/A'}</td>
                <td>${record.CourseName || 'N/A'}</td>
                <td>${record.Topic || 'N/A'}</td>
                <td><span class="${statusClass}">${record.Status || 'N/A'}</span></td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading attendance: ' + err.message);
    }
}

async function addAttendance(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        studentId: parseInt(form.studentId.value),
        lectureId: parseInt(form.lectureId.value),
        status: form.status.value
    };

    if (!payload.studentId || !payload.lectureId || !payload.status) {
        showError('All fields are required');
        return;
    }

    if (!['Present', 'Absent', 'Partial'].includes(payload.status)) {
        showError('Status must be Present, Absent, or Partial');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Recording...';

    try {
        const res = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Attendance recorded successfully!');
            form.reset();
            fetchAttendance();
        } else {
            showError(data.error || 'Error recording attendance');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Record Attendance';
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
    fetchAttendance();
};

