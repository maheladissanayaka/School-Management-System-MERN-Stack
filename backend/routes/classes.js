const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Get all classes with Teacher details populated
// Matches GET /api/classes
router.get('/', protect, async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher', 'name');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create a new class (This was missing!)
// Matches POST /api/classes
router.post('/', protect, authorize(['admin']), async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    // Populate teacher name before sending back to frontend
    const populatedClass = await Class.findById(savedClass._id).populate('classTeacher', 'name');
    res.status(201).json(populatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update a class
// Matches PUT /api/classes/:id
router.put('/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('classTeacher', 'name');
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete a class
// Matches DELETE /api/classes/:id
router.delete('/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ msg: "Class removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;