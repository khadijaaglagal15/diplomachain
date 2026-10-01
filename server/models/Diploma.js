import mongoose from 'mongoose';

const diplomaSchema = new mongoose.Schema({
  diplomaHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  universityName: {
    type: String,
    required: true,
    trim: true
  },
  universityAddress: {
    type: String,
    required: true,
    trim: true
  },
  diplomaName: {
    type: String,
    required: true,
    trim: true
  },
  ipfsHash: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  },
  revokedDate: {
    type: Date
  },
  revokedReason: {
    type: String,
    trim: true
  },
  metadata: {
    type: Object,
    default: {}
  }
});

export const Diploma = mongoose.model('Diploma', diplomaSchema);