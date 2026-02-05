const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  parentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Mother', 'Father', 'Guardian'], required: true },
  nic: { type: String, required: true }, // National ID
  job: { type: String },
  dob: { type: Date },
  address: { type: String },
  contact: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  
  // Link to Students (One parent can have multiple students)
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Parent', ParentSchema);