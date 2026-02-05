const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Grade 10-A
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomNumber: { type: String },
  studentCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);