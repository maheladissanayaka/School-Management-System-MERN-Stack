const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User'); // 1. Import User Model to update teachers

// Ensure this path matches your actual file name ('../middleware/authMiddleware')
const { protect, authorize } = require('../middleware/authMiddleware'); 

// @desc    Get all subjects (with teacher details)
// @route   GET /api/subjects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('teachers', 'name image email') 
      .sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, code, teachers } = req.body;

    // Check if code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ msg: 'Subject code already exists' });
    }

    const newSubject = new Subject({
      name,
      code,
      teachers // Expecting an array of User IDs e.g. ["65a...", "65b..."]
    });

    const savedSubject = await newSubject.save();
    
    // 👇 AUTOMATICALLY UPDATE THE TEACHERS 👇
    // This finds all teachers in the list and sets their 'subject' field to this new subject ID
    if (teachers && teachers.length > 0) {
      await User.updateMany(
        { _id: { $in: teachers } }, 
        { $set: { subject: savedSubject._id } }
      );
    }
    
    // Populate the response immediately so the UI updates nicely
    const populatedSubject = await savedSubject.populate('teachers', 'name image');
    
    res.status(201).json(populatedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get subjects by Teacher ID
// @route   GET /api/subjects/teacher/:teacherId
// @access  Private
router.get('/teacher/:teacherId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ teachers: req.params.teacherId })
      .populate('teachers', 'name image'); // Populate teacher details if needed elsewhere
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, code, teachers } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, teachers },
      { new: true } // Return the updated document
    ).populate('teachers', 'name image');

    if (!updatedSubject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // 👇 AUTOMATICALLY UPDATE THE TEACHERS 👇
    if (teachers && teachers.length > 0) {
      // Set subject for the assigned teachers
      await User.updateMany(
        { _id: { $in: teachers } }, 
        { $set: { subject: updatedSubject._id } }
      );
    }

    res.json(updatedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // Optional: Remove subject link from teachers when subject is deleted
    await User.updateMany({ subject: req.params.id }, { $unset: { subject: "" } });

    res.json({ msg: 'Subject removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;