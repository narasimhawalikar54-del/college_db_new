const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001; // Changed port to avoid conflicts

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/courses', require('./routes/courses'));

// mount auth routes
app.use('/api/auth', require('./routes/auth'));

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'welcome.html'));
});

// Health check (placed before fallback so it's reachable)
app.get('/health', (req, res) => {
    res.send('Server is running');
});

// Fallback: serve frontend for non-API requests without using path-to-regexp patterns
app.use((req, res, next) => {
    // If request is for an API route or accepts JSON, pass through
    if (req.path.startsWith('/api/') || req.accepts('json')) {
        return next();
    }
    // Serve frontend entry for other GET requests (single-page app style)
    if (req.method === 'GET') {
        return res.sendFile(path.join(__dirname, 'frontend', 'welcome.html'));
    }
    next();
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server with error handling
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Frontend available at:');
    console.log(`  http://localhost:${port}/welcome.html`);
    console.log(`  http://localhost:${port}/auth.html`);
    console.log(`  http://localhost:${port}/courses.html`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        server.listen(port + 1);
    } else {
        console.error('Server error:', err);
    }
});
