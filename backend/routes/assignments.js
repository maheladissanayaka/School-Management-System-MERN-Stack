const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const User = require('../models/User'); // To check student grade
const { protect, authorize } = require('../middleware/authMiddleware');

// ==========================================
// 1. Get Assignments (Role Based Logic)
// ==========================================
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If Student: Only show assignments for THEIR grade
    if (req.user.role === 'student') {
      const student = await User.findById(req.user.id);
      if (student && student.grade) {
        query.grade = student.grade;
      } else {
        return res.json([]); 
      }
    }
    // Visitors/Admins/Teachers see ALL (or you can filter teachers to see only theirs)

    const assignments = await Assignment.find(query)
      .populate('grade', 'name')
      .populate('teacher', 'name image subject')
      // 👇 IMPORTANT: Populate student info inside submissions array for Teacher View
      .populate({
          path: 'submissions.student',
          select: 'name email image'
      })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. Create Assignment (Teacher Only)
// ==========================================
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, grade, subject, deadline, fileUrl } = req.body;

    const newAssignment = new Assignment({
      title,
      description,
      grade,
      subject, 
      teacher: req.user.id, 
      deadline,
      fileUrl
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. Submit Assignment (Student Only)
// ==========================================
router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { fileUrl, remarks } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    // Check Deadline
    if (new Date() > new Date(assignment.deadline)) {
      return res.status(400).json({ msg: "Submission portal is closed (Deadline passed)" });
    }

    // Check if Portal is manually closed
    if (!assignment.isPortalOpen) {
      return res.status(400).json({ msg: "Teacher has closed the submission portal" });
    }

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );

    if (alreadySubmitted) {
      // Update existing submission
      alreadySubmitted.fileUrl = fileUrl;
      alreadySubmitted.submittedAt = Date.now();
      alreadySubmitted.remarks = remarks;
    } else {
      // Add new submission
      assignment.submissions.push({
        student: req.user.id,
        fileUrl,
        remarks
      });
    }

    await assignment.save();
    res.json({ msg: "Assignment submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. Toggle Portal (Teacher Only)
// ==========================================
router.put('/:id/toggle', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if(!assignment) return res.status(404).json({msg: "Not found"});

        assignment.isPortalOpen = !assignment.isPortalOpen;
        await assignment.save();
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. Update Assignment Details (Teacher Only)
// ==========================================
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, grade, subject, deadline, fileUrl } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        grade, 
        subject, 
        deadline, 
        // Only update fileUrl if a new one is provided
        ...(fileUrl && { fileUrl }) 
      },
      { new: true }
    );

    if (!updatedAssignment) return res.status(404).json({ msg: "Assignment not found" });
    res.json(updatedAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. Delete Assignment (Teacher Only)
// ==========================================
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    await assignment.deleteOne();
    res.json({ msg: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;