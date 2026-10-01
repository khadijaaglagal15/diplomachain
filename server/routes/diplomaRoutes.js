import express from 'express';
import { Diploma } from '../models/Diploma.js';

const router = express.Router();

// Get all diplomas
router.get('/', async (req, res) => {
  try {
    const diplomas = await Diploma.find();
    res.status(200).json(diplomas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get diploma by hash
router.get('/hash/:hash', async (req, res) => {
  try {
    const diploma = await Diploma.findOne({ diplomaHash: req.params.hash });
    if (!diploma) {
      return res.status(404).json({ message: 'Diploma not found' });
    }
    res.status(200).json(diploma);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get diplomas by university address
router.get('/university/:address', async (req, res) => {
  try {
    const diplomas = await Diploma.find({ universityAddress: req.params.address });
    res.status(200).json(diplomas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get diplomas by student name
router.get('/student/:name', async (req, res) => {
  try {
    const diplomas = await Diploma.find({ 
      studentName: { $regex: req.params.name, $options: 'i' } 
    });
    res.status(200).json(diplomas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new diploma
router.post('/', async (req, res) => {
  const diploma = new Diploma({
    diplomaHash: req.body.diplomaHash,
    studentName: req.body.studentName,
    studentId: req.body.studentId,
    universityName: req.body.universityName,
    universityAddress: req.body.universityAddress,
    diplomaName: req.body.diplomaName,
    ipfsHash: req.body.ipfsHash,
    issueDate: req.body.issueDate || Date.now(),
    isValid: true,
    metadata: req.body.metadata || {}
  });

  try {
    const newDiploma = await diploma.save();
    res.status(201).json(newDiploma);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Revoke diploma
router.patch('/revoke/:hash', async (req, res) => {
  try {
    const diploma = await Diploma.findOne({ diplomaHash: req.params.hash });
    if (!diploma) {
      return res.status(404).json({ message: 'Diploma not found' });
    }

    diploma.isValid = false;
    diploma.revokedDate = Date.now();
    diploma.revokedReason = req.body.reason || 'Not specified';
    
    const updatedDiploma = await diploma.save();
    res.status(200).json(updatedDiploma);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update diploma metadata
router.patch('/metadata/:hash', async (req, res) => {
  try {
    const diploma = await Diploma.findOne({ diplomaHash: req.params.hash });
    if (!diploma) {
      return res.status(404).json({ message: 'Diploma not found' });
    }

    diploma.metadata = { ...diploma.metadata, ...req.body.metadata };
    
    const updatedDiploma = await diploma.save();
    res.status(200).json(updatedDiploma);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const diplomaRoutes = router;