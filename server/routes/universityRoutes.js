import express from 'express';
import { University } from '../models/University.js';

const router = express.Router();

// Get all universities
router.get('/', async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json(universities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get university by address
router.get('/address/:address', async (req, res) => {
  try {
    const university = await University.findOne({ address: req.params.address });
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.status(200).json(university);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new university
router.post('/', async (req, res) => {
  const university = new University({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    website: req.body.website,
    country: req.body.country,
    isAuthorized: req.body.isAuthorized || false,
    isActive: req.body.isActive || true
  });

  try {
    const newUniversity = await university.save();
    res.status(201).json(newUniversity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update university
router.patch('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    // Update fields that are present in the request
    if (req.body.name) university.name = req.body.name;
    if (req.body.email) university.email = req.body.email;
    if (req.body.website) university.website = req.body.website;
    if (req.body.country) university.country = req.body.country;
    if (req.body.isAuthorized !== undefined) {
      university.isAuthorized = req.body.isAuthorized;
      if (req.body.isAuthorized) {
        university.authorizedDate = Date.now();
      }
    }
    if (req.body.isActive !== undefined) university.isActive = req.body.isActive;

    const updatedUniversity = await university.save();
    res.status(200).json(updatedUniversity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Authorize university
router.patch('/authorize/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    university.isAuthorized = true;
    university.authorizedDate = Date.now();
    
    const updatedUniversity = await university.save();
    res.status(200).json(updatedUniversity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deactivate university
router.patch('/deactivate/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    university.isActive = false;
    
    const updatedUniversity = await university.save();
    res.status(200).json(updatedUniversity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete university
router.delete('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    
    await University.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'University deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const universityRoutes = router;