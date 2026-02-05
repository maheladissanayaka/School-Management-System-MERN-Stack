const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // Link to Class/Grade
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  
  // Link to Subject (can be string or ID)
  subject: { type: String, required: true },
  
  // The Teacher who created it
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Teacher's Uploaded Document (PDF/Doc)
  fileUrl: { type: String }, 
  
  deadline: { type: Date, required: true },
  
  // Manual toggle to open/close portal
  isPortalOpen: { type: Boolean, default: true },

  // Array to store student submissions
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: { type: String, required: true }, // Student's uploaded file
    submittedAt: { type: Date, default: Date.now },
    remarks: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);