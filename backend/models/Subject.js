const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  // Relationship: Many Teachers can teach one Subject
  teachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);