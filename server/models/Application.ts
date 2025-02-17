import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  academicDetails: {
    school: { type: String, required: true },
    marks: { type: Number, required: true }
  },
  documents: [{ name: String, url: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application
