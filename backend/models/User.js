const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = new mongoose.Schema({
  // ... (Existing fields) ...
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'visitor'], default: 'student' },
  
  // Student
  studentId: { type: String, unique: true, sparse: true }, 
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, 

  // Teacher
  teacherId: { type: String, unique: true, sparse: true }, 
  
  // 👇 FIXED: Changed from String to ObjectId Reference
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject' // Links to the Subject Model
  },
  
  registerDate: { type: Date },
  qualifications: [{ type: String }], 
  experience: [{ type: String }],     

  // Visitor
  visitorId: { type: String, unique: true, sparse: true },
  department: { type: String }, 
  position: { type: String },   
  nic: { type: String },        

  // Common
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  image: { type: String }, 
  contact: { type: String },
  address: { type: String },
  dob: { type: Date },
}, { timestamps: true });

// ==========================================
// 🔒 PASSWORD ENCRYPTION
// ==========================================
UserSchema.pre('save', async function() {
  // If password is not modified, just return
  if (!this.isModified('password')) {
    return;
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);