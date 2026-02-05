const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
// 👇 Ensure this path matches your file name ('../middleware/authMiddleware')
const { protect, authorize } = require('../middleware/authMiddleware');

// ==============================================================================
// 1. Get All Parents
// 🟢 FIXED: Added 'visitor' to allowed roles so the Visitor account doesn't crash
// ==============================================================================
router.get('/', protect, authorize('admin', 'teacher', 'visitor'), async (req, res) => {
  try {
    const parents = await Parent.find()
      .populate('students', 'name studentId image grade')
      .sort({ createdAt: -1 });
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================================
// 2. GET Parents by Student ID (For Student Profile)
// 🟢 FIXED: Added 'visitor' here too, so visitors can see parents on the profile page
// ==============================================================================
router.get('/student/:id', protect, authorize('admin', 'teacher', 'student', 'visitor'), async (req, res) => {
  try {
    const parents = await Parent.find({ students: req.params.id })
      .populate({
        path: 'students',
        select: 'name studentId image grade email contact',
        populate: { path: 'grade', select: 'name' }
      });
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create Parent
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { parentId, name, type, nic, job, dob, address, contact, image, students } = req.body;

    // Check if Parent ID or NIC already exists
    const existingParent = await Parent.findOne({ $or: [{ parentId }, { nic }] });
    if (existingParent) {
      return res.status(400).json({ msg: 'Parent ID or NIC already exists' });
    }

    const newParent = new Parent({
      parentId, name, type, nic, job, dob, address, contact, image, students
    });

    const savedParent = await newParent.save();
    res.status(201).json(savedParent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Parent
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('students', 'name');

    if (!updatedParent) return res.status(404).json({ msg: "Parent not found" });

    res.json(updatedParent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete Parent
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const deletedParent = await Parent.findByIdAndDelete(req.params.id);
    if (!deletedParent) return res.status(404).json({ msg: "Parent not found" });
    
    res.json({ msg: "Parent record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;