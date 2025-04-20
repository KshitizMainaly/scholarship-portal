
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

// Ensure uploads directory exists
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR)); // Serve uploaded files

// Application Schema
const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  citizenshipNumber: String,
  university: String,
  program: String,
  seeCertificatePath: String,
  plusTwoCertificatePath: String,
  ethnicity: String,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
   createdAt: { type: Date, default: Date.now }

});

const Application = mongoose.model('Application', applicationSchema);

// Application Upload Route
app.post(
  '/api/applications',
  upload.fields([
    { name: 'seeCertificate', maxCount: 1 },
    { name: 'plusTwoCertificate', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, email, citizenshipNumber, university, program } = req.body;

      if (
        !name || !email || !citizenshipNumber || !university || !program ||
        !req.files['seeCertificate'] || !req.files['plusTwoCertificate']
      ) {
        return res.status(400).json({ error: 'All fields and both certificates are required.' });
      }

      const seeCertificatePath = req.files['seeCertificate'][0].path;
      const plusTwoCertificatePath = req.files['plusTwoCertificate'][0].path;

      const application = new Application({
        name,
        email,
        citizenshipNumber,
        university,
        program,
        seeCertificatePath,
        plusTwoCertificatePath
      });

      await application.save();
      res.status(201).json(application);
    } catch (error) {
      console.error('❌ Error saving application:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get All Applications
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle file upload errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only PDF, JPG, and PNG')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
