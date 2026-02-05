const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRoles: [{ 
    type: String, 
    enum: ['admin', 'teacher', 'student', 'visitor', 'all'] 
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);