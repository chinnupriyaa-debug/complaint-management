import mongoose from 'mongoose';

// Complaint Schema with full tracking
const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentUsername: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true,
    enum: [
      'Academic',
      'Infrastructure',
      'Library',
      'Hostel',
      'Canteen',
      'Transportation',
      'Lab Equipment',
      'Wi-Fi/Internet',
      'Examination',
      'Other'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  complaint: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Rectified', 'Rejected'],
    default: 'Pending'
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  facultyResponse: {
    type: String
  },
  alertSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

// Index for faster queries
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ facultyId: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
