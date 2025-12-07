const express = require('express');
const cors = require('cors');
const tryonRoutes = require('./routes/tryon');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.send('Backend is running'));
app.use('/api/tryon', tryonRoutes);

module.exports = app;
