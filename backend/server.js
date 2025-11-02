const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/classes', require('./routes/classes'));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Serve welcome page at root
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/welcome.html'));
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
