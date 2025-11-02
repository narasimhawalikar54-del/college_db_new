// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchLectures() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('lecture-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/lectures');
        
        if (!res.ok) {
            throw new Error('Failed to fetch lectures');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(lecture => {
            const row = document.createElement('tr');
            const date = new Date(lecture.Date).toLocaleDateString();
            const time = lecture.Time || 'N/A';
            
            row.innerHTML = `
                <td><strong>${lecture.LectureId || 'N/A'}</strong></td>
                <td>${date}</td>
                <td>${time}</td>
                <td>${lecture.Topic || 'N/A'}</td>
                <td>${lecture.CourseName || lecture.CourseId || 'N/A'}</td>
                <td>Sem ${lecture.Sem || 'N/A'} - ${lecture.Branch || 'N/A'}</td>
                <td>${lecture.RoomNo || 'N/A'}</td>
                <td>${lecture.Duration || 'N/A'} min</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading lectures: ' + err.message);
    }
}

async function addLecture(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        date: form.date.value,
        time: form.time.value,
        duration: parseInt(form.duration.value),
        topic: form.topic.value.trim(),
        roomNo: form.roomNo.value.trim(),
        meetLink: form.meetLink.value.trim() || null,
        courseId: form.courseId.value.trim(),
        classId: parseInt(form.classId.value)
    };

    if (!payload.date || !payload.time || !payload.duration || !payload.topic || !payload.roomNo || !payload.courseId || !payload.classId) {
        showError('All required fields must be filled');
        return;
    }

    if (payload.duration < 1 || payload.duration > 480) {
        showError('Duration must be between 1 and 480 minutes');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/lectures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Lecture added successfully!');
            form.reset();
            fetchLectures();
        } else {
            showError(data.error || 'Error adding lecture');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Lecture';
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
    fetchLectures();
};

