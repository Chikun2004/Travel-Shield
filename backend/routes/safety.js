const express = require('express');
const router = express.Router();
const SafetyAlert = require('../models/SafetyAlert');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get safety alerts within radius
router.get('/alerts', async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query; // radius in meters

        const alerts = await SafetyAlert.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            },
            status: 'active'
        }).populate('reporter', 'username');

        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new safety alert
router.post('/alerts', [
    auth,
    body('type').isIn(['theft', 'scam', 'unsafe_zone', 'harassment', 'other']),
    body('description').trim().notEmpty(),
    body('severity').isIn(['low', 'medium', 'high']),
    body('location').isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, description, severity, location, images } = req.body;

        const alert = new SafetyAlert({
            reporter: req.user.id,
            type,
            description,
            severity,
            location,
            images
        });

        await alert.save();
        res.status(201).json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify safety alert
router.post('/alerts/:id/verify', auth, async (req, res) => {
    try {
        const alert = await SafetyAlert.findById(req.params.id);
        
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.verifiedBy.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already verified by user' });
        }

        alert.verificationCount += 1;
        alert.verifiedBy.push(req.user.id);
        await alert.save();

        res.json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update alert status
router.patch('/alerts/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        const alert = await SafetyAlert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.reporter.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        alert.status = status;
        await alert.save();

        res.json(alert);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
