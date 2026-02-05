const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// ========================================================
// 🛠️ FIX ROUTE (Use only if needed to clean data)
// ========================================================
router.get('/fix-subjects', async (req, res) => {
  try {
    await User.updateMany(
        { subject: { $type: "string" } }, 
        { $unset: { subject: "" } }      
    );
    res.send("✅ DATABASE FIXED: Old text subjects removed.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Get All Teachers
router.get('/teachers', protect, authorize('admin', 'teacher', 'student', 'visitor'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .populate('subject', 'name code') 
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Students
router.get('/students', protect, authorize('admin', 'teacher', 'visitor'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate('grade', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Visitors
router.get('/', protect, authorize('admin', 'teacher', 'visitor'), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role: role.toLowerCase() } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================================
// 4. 👇 FIXED: Get Single User by ID (Allowed for Teachers)
// ==========================================================
router.get('/:id', protect, async (req, res) => {
  try {
    const userToView = await User.findById(req.params.id);

    if (!userToView) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Logic: 
    // 1. Admins, Teachers, and Visitors can view ANY profile.
    // 2. Students can only view their OWN profile.
    const allowedRoles = ['admin', 'teacher', 'visitor'];
    const isAuthorizedRole = allowedRoles.includes(req.user.role);
    const isOwnProfile = req.user.id === req.params.id;

    if (!isAuthorizedRole && !isOwnProfile) {
      return res.status(403).json({ msg: "Not authorized to view this profile" });
    }

    // Populate necessary fields
    const populatedUser = await User.findById(req.params.id)
      .select('-password')
      .populate('grade', 'name')
      .populate('subject', 'name code'); 

    res.json(populatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Update User
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { 
      name, email, contact, address, gender, 
      grade, studentId, image, dob,
      teacherId, subject, registerDate, qualifications, experience,
      visitorId, department, position, nic
    } = req.body;

    const gradeId = (grade && typeof grade === 'object') ? grade._id : grade;
    const subjectId = (subject && typeof subject === 'object') ? subject._id : subject;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        name, email, contact, address, gender, image, dob,
        ...(gradeId && { grade: gradeId }), 
        ...(studentId && { studentId }),
        ...(teacherId && { teacherId }),
        ...(subjectId && { subject: subjectId }),
        ...(registerDate && { registerDate }),
        ...(qualifications && { qualifications }),
        ...(experience && { experience }),
        ...(visitorId && { visitorId }),
        ...(department && { department }),
        ...(position && { position }),
        ...(nic && { nic })
      },
      { new: true, runValidators: true }
    )
    .populate('grade', 'name')
    .populate('subject', 'name code');

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Delete User
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;