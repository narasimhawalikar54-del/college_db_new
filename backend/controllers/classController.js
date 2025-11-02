const db = require('../config/db');

module.exports = {
    // GET /api/classes
    async getAll(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM CLASS ORDER BY ClassId DESC');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/classes
    async create(req, res) {
        const { sem, branch, startDate, endDate, degree } = req.body;
        
        // Validation
        if (!sem || !branch || !startDate || !endDate || !degree) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const [result] = await db.query(
                'INSERT INTO CLASS (Sem, Branch, StartDate, EndDate, Degree) VALUES (?, ?, ?, ?, ?)',
                [sem, branch, startDate, endDate, degree]
            );
            res.status(201).json({ success: true, id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
