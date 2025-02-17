import express from 'express';
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Submit a scholarship application
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { personalDetails, academicDetails, documents } = req.body;
    const application = new Application({
      studentId: req.user.userId,
      personalDetails,
      academicDetails,
      documents
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch all applications (for admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    const applications = await Application.find().populate('studentId', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;