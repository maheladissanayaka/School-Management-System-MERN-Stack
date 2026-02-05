const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const announcementRoutes = require('./routes/announcements');
const parentRoutes = require('./routes/parents');
const subjectRoutes = require('./routes/subjects');
const assignmentRoutes = require('./routes/assignments'); // ✅ NEW IMPORT

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// 4. Connect Routes
// These prefixes must match your frontend service URLs
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/classes', classRoutes); 
app.use('/api/announcements', announcementRoutes); 
app.use('/api/parents', parentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/assignments', assignmentRoutes); // ✅ NEW ROUTE

// Test Route
app.get('/', (req, res) => res.send("School Management API is Running..."));

// 5. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});