async function fetchCourses() {
    const res = await fetch('/api/courses');
    const data = await res.json();
    const table = document.getElementById('course-table-body');
    table.innerHTML = '';
    data.forEach(course => {
        const row = `<tr>
            <td>${course.CourseCode}</td>
            <td>${course.Name}</td>
            <td>${course.Credits}</td>
            <td>${course.DeptName}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

async function addCourse(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
        courseCode: form.courseCode.value,
        name: form.name.value,
        credits: form.credits.value,
        deptName: form.deptName.value
    };
    
    const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Course inserted successfully!');
        form.reset();
        fetchCourses();
    } else {
        alert('Error inserting course.');
    }
}

window.onload = fetchCourses;
