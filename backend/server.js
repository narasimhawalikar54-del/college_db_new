const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the FRONTEND directory (one level up)
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// API Routes - All routes are loaded from the './routes' directory
const routes = [
    { path: '/api/auth', file: './routes/auth', name: 'Auth' },
    { path: '/api/courses', file: './routes/courses', name: 'Courses' },
    { path: '/api/classes', file: './routes/classes', name: 'Classes' },
    { path: '/api/teachers', file: './routes/teachers', name: 'Teachers' },
    { path: '/api/students', file: './routes/students', name: 'Students' },
    { path: '/api/lectures', file: './routes/lectures', name: 'Lectures' },
    { path: '/api/attendance', file: './routes/attendance', name: 'Attendance' },
    { path: '/api/reports', file: './routes/reports', name: 'Reports' },
    { path: '/api/assignments', file: './routes/assignments', name: 'Assignments' },
    { path: '/api/curriculum', file: './routes/curriculum', name: 'Curriculum' },
    // New route for your lecturer's complex views
    { path: '/api/views', file: './routes/views', name: 'Views' } 
];

routes.forEach(route => {
    try {
        app.use(route.path, require(route.file));
        console.log(`✓ ${route.name} routes loaded`);
    } catch (err) {
        console.error(`✗ Error loading ${route.name} routes from ${route.file}:`, err.message);
    }
});

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Serve welcome page at root
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../FRONTEND/welcome.html'));
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not Found', path: req.originalUrl });
    }
    // For any other 404, send the main welcome page
	res.status(404).sendFile(path.join(__dirname, '../FRONTEND/welcome.html'));
});

app.listen(port, () => {
	console.log(`✓ Server running on http://localhost:${port}`);
	console.log(`✓ Health check: http://localhost:${port}/health`);
	console.log(`✓ Frontend: http://localhost:${port}/`);
}).on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`✗ Port ${port} is already in use. Please stop other servers or use a different port.`);
	} else {
		console.error('✗ Server error:', err.message);
	}
	process.exit(1);
});










