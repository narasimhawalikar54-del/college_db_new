// Check authentication
if (!localStorage.getItem('authToken')) {
    window.location.href = '/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
}

async function fetchReports() {
    const loading = document.getElementById('loading-message');
    const table = document.querySelector('table');
    const emptyState = document.getElementById('empty-state');
    const tableBody = document.getElementById('report-table-body');

    try {
        loading.style.display = 'block';
        table.style.display = 'none';
        emptyState.style.display = 'none';

        const res = await fetch('/api/reports');
        
        if (!res.ok) {
            throw new Error('Failed to fetch reports');
        }

        const data = await res.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(report => {
            const row = document.createElement('tr');
            const studentName = `${report.FName || ''} ${report.LName || ''}`.trim();
            const totalMarks = (report.SEEMarks || 0) + (report.CIEMarks || 0);
            const gradeClass = report.Grade === 'A' || report.Grade === 'A+' ? 'grade-excellent' :
                             report.Grade === 'B' || report.Grade === 'B+' ? 'grade-good' :
                             report.Grade === 'C' || report.Grade === 'C+' ? 'grade-average' : 'grade-poor';
            
            row.innerHTML = `
                <td>${studentName || 'N/A'}</td>
                <td>${report.Email || 'N/A'}</td>
                <td>${report.CourseName || report.CourseId || 'N/A'}</td>
                <td>Sem ${report.Sem || 'N/A'} - ${report.Branch || 'N/A'}</td>
                <td>${report.SEEMarks !== undefined ? report.SEEMarks : 'N/A'}</td>
                <td>${report.CIEMarks !== undefined ? report.CIEMarks : 'N/A'}</td>
                <td class="${gradeClass}"><strong>${report.Grade || 'N/A'}</strong></td>
                <td>${report.Remark || '-'}</td>
            `;
            tableBody.appendChild(row);
        });

        table.style.display = 'table';
    } catch (err) {
        loading.style.display = 'none';
        showError('Error loading reports: ' + err.message);
    }
}

async function addReport(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const payload = {
        studentId: parseInt(form.studentId.value),
        courseId: form.courseId.value.trim(),
        classId: parseInt(form.classId.value),
        seeMarks: parseInt(form.seeMarks.value),
        cieMarks: parseInt(form.cieMarks.value),
        grade: form.grade.value.trim(),
        remark: form.remark.value.trim() || null
    };

    if (!payload.studentId || !payload.courseId || !payload.classId || 
        payload.seeMarks === undefined || payload.cieMarks === undefined || !payload.grade) {
        showError('All required fields must be filled');
        return;
    }

    if (payload.seeMarks < 0 || payload.seeMarks > 100 || payload.cieMarks < 0 || payload.cieMarks > 100) {
        showError('Marks must be between 0 and 100');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const res = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess('Report saved successfully!');
            form.reset();
            fetchReports();
        } else {
            showError(data.error || 'Error saving report');
        }
    } catch (err) {
        showError('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Report';
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
    fetchReports();
};

