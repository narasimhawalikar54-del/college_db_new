// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

// Get user info and display
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchCourses() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('course-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/courses');
        
        if (!res.ok) {
            throw new Error('Failed to fetch courses');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${course.CourseCode || 'N/A'}</strong></td>
                <td>${course.Name || 'N/A'}</td>
                <td>${course.Credits || 'N/A'}</td>
                <td>${course.DeptName || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading courses: ' + err.message);
    }
}

async function addCourse(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        courseCode: form.courseCode.value.trim(),
        name: form.name.value.trim(),
        credits: parseInt(form.credits.value),
        deptName: form.deptName.value.trim()
    };

    // Validation
    if (!payload.courseCode || !payload.name || !payload.credits || !payload.deptName) {
        showError('All fields are required');
        return;
    }

    if (payload.credits < 1 || payload.credits > 10) {
        showError('Credits must be between 1 and 10');
        return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Course added successfully!');
            form.reset();
            fetchCourses();
        } else {
            showError(data.error || 'Error adding course');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Course';
    }
}

async function loadBranches() {
    try {
        const res = await fetch('/api/courses/branches');
        if (!res.ok) return;
        const branches = await res.json();
        const sel = document.getElementById('branch-filter');
        branches.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.textContent = b;
            sel.appendChild(opt);
        });
        sel.addEventListener('change', onBranchChange);
    } catch (err) {
        console.error('Failed to load branches', err);
    }
}

async function onBranchChange(e) {
    const branch = e.target.value;
    const title = document.getElementById('list-title');
    if (!branch) {
        title.textContent = 'All Courses';
        fetchCourses(); // show courses when no branch selected
        return;
    }

    // fetch students for the branch
    try {
        const res = await fetch(`/api/courses?branch=${encodeURIComponent(branch)}`);
        const data = await res.json();
        // API returns either { students: [...] } or { courses: [...] } depending on backend fallback
        if (data.students) {
            renderStudents(data.students);
            title.textContent = `Students in ${branch}`;
        } else if (data.courses) {
            renderCourses(data.courses);
            title.textContent = `Courses for ${branch}`;
        } else {
            // Unknown shape, attempt to render as rows
            renderStudents(data);
            title.textContent = `Results for ${branch}`;
        }
    } catch (err) {
        console.error(err);
        alert('Error fetching filtered data');
    }
}

function renderCourses(courses) {
    const head = document.getElementById('list-head');
    head.innerHTML = `<tr>
        <th>Course Code</th>
        <th>Name</th>
        <th>Credits</th>
        <th>Department Name</th>
    </tr>`;
    const tbody = document.getElementById('course-table-body');
    tbody.innerHTML = '';
    courses.forEach(course => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${course.CourseCode}</td>
                        <td>${course.Name}</td>
                        <td>${course.Credits}</td>
                        <td>${course.DeptName}</td>`;
        tbody.appendChild(tr);
    });
}

function renderStudents(students) {
    const head = document.getElementById('list-head');
    head.innerHTML = `<tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Branch</th>
        <th>Course Code</th>
    </tr>`;
    const tbody = document.getElementById('course-table-body');
    tbody.innerHTML = '';
    students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.StudentID ?? s.id ?? ''}</td>
                        <td>${s.StudentName ?? s.Name ?? s.name ?? ''}</td>
                        <td>${s.Branch ?? ''}</td>
                        <td>${s.CourseCode ?? ''}</td>`;
        tbody.appendChild(tr);
    });
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
}

function showError(message) {
    // Create or update error message
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
    // Create or update success message
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
    loadBranches();
    fetchCourses();
    const form = document.getElementById('add-course-form');
    if (form) form.addEventListener('submit', addCourse);
};
