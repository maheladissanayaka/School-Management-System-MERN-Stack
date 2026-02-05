const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Create Announcement
router.post('/', protect, authorize(['admin']), async (req, res) => {
  try {
    // FIX: Destructure targetRoles (plural) to match frontend formData
    const { title, content, targetRoles } = req.body; 
    
    const newAnnouncement = new Announcement({
      title,
      content,
      targetRoles: targetRoles.length > 0 ? targetRoles : ['all'], 
      createdBy: req.user._id
    });
    
    const saved = await newAnnouncement.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update Announcement (Matches PUT /api/announcements/:id)
router.put('/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    const { title, content, targetRoles } = req.body;
    
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, targetRoles },
      { new: true } // Returns the updated document
    );
    
    if (!updated) return res.status(404).json({ msg: "Announcement not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete Announcement
router.delete('/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: "Announcement removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get All
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;