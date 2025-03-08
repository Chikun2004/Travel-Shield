const express = require('express');
const router = express.Router();
const TravelClaim = require('../models/TravelClaim');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get user's claims
router.get('/claims', auth, async (req, res) => {
    try {
        const claims = await TravelClaim.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single claim
router.get('/claims/:id', auth, async (req, res) => {
    try {
        const claim = await TravelClaim.findById(req.params.id);
        
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        if (claim.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new claim
router.post('/claims', [
    auth,
    body('travelType').isIn(['flight', 'train', 'bus']),
    body('issueType').isIn(['delay', 'cancellation', 'overbooking', 'baggage', 'other']),
    body('description').trim().notEmpty(),
    body('transportationDetails').isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const claim = new TravelClaim({
            ...req.body,
            user: req.user.id,
            timeline: [{
                status: 'pending',
                note: 'Claim submitted'
            }]
        });

        await claim.save();
        res.status(201).json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update claim
router.patch('/claims/:id', auth, async (req, res) => {
    try {
        const claim = await TravelClaim.findById(req.params.id);
        
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        if (claim.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow updates to description and evidence
        const { description, evidence } = req.body;
        if (description) claim.description = description;
        if (evidence) claim.evidence = evidence;

        claim.timeline.push({
            status: claim.status,
            note: 'Claim updated by user'
        });

        await claim.save();
        res.json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check compensation eligibility
router.post('/check-eligibility', [
    auth,
    body('travelType').isIn(['flight', 'train', 'bus']),
    body('issueType').isIn(['delay', 'cancellation', 'overbooking', 'baggage', 'other']),
    body('transportationDetails').isObject()
], async (req, res) => {
    try {
        const { travelType, issueType, transportationDetails } = req.body;

        // Simple eligibility rules (can be expanded based on actual regulations)
        let eligible = false;
        let estimatedCompensation = 0;
        let reason = '';

        if (travelType === 'flight') {
            if (issueType === 'delay' && transportationDetails.delayDuration >= 3) {
                eligible = true;
                estimatedCompensation = 300;
                reason = 'Flight delay over 3 hours';
            } else if (issueType === 'cancellation') {
                eligible = true;
                estimatedCompensation = 600;
                reason = 'Flight cancellation';
            }
        }

        res.json({
            eligible,
            estimatedCompensation,
            reason,
            currency: 'USD'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
