const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, role, 
      studentId, grade, // Student fields
      teacherId, subject, registerDate, qualifications, experience, // Teacher fields
      visitorId, department, position, nic, // Visitor fields
      gender, image, contact, address, dob // Common fields
    } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 2. PREPARE DATA (Crucial Step: Clean empty strings)
    // If 'grade' is empty string "", set it to undefined so Mongoose ignores it
    const validGrade = (grade && grade !== "") ? grade : undefined;
    
    // If 'dob' is empty string "", set it to undefined
    const validDob = (dob && dob !== "") ? dob : undefined;

    // If 'registerDate' is empty, set undefined
    const validRegisterDate = (registerDate && registerDate !== "") ? registerDate : undefined;

    // 3. Create User Object safely
    user = new User({
      name, 
      email, 
      password, 
      role,
      gender, 
      image, 
      contact, 
      address, 
      dob: validDob, // Use cleaned date
      
      // --- Student Specific ---
      ...(role === 'student' && { 
          studentId, 
          grade: validGrade // Use cleaned grade
      }),
      
      // --- Teacher Specific ---
      ...(role === 'teacher' && { 
          teacherId, 
          subject, 
          registerDate: validRegisterDate, 
          qualifications: qualifications || [], 
          experience: experience || [] 
      }),

      // --- Visitor Specific ---
      ...(role === 'visitor' && { 
          visitorId, 
          department, 
          position, 
          nic 
      })
    });

    // 4. Save (Password is hashed automatically by User.js model)
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err.message);
    
    // Handle specific errors clearly
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message }); // Tell frontend exactly what is wrong
    }
    if (err.code === 11000) {
       return res.status(400).json({ msg: "Email or ID already exists" });
    }

    res.status(500).send("Server error");
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;