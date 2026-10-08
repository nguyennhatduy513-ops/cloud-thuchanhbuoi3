const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentCode: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  age: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);