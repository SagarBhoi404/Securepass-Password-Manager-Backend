const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const cors = require('cors')

require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
