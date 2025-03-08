const express = require('express');
const router = express.Router();
const Homestay = require('../models/Homestay');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all homestays with filters
router.get('/', async (req, res) => {
    try {
        const {
            city,
            minPrice,
            maxPrice,
            guests,
            checkIn,
            checkOut
        } = req.query;

        let query = { status: 'active' };

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        if (minPrice || maxPrice) {
            query['price.perNight'] = {};
            if (minPrice) query['price.perNight'].$gte = parseInt(minPrice);
            if (maxPrice) query['price.perNight'].$lte = parseInt(maxPrice);
        }

        if (guests) {
            query['capacity.guests'] = { $gte: parseInt(guests) };
        }

        const homestays = await Homestay.find(query)
            .populate('host', 'username email')
            .select('-rules -availability');

        res.json(homestays);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single homestay
router.get('/:id', async (req, res) => {
    try {
        const homestay = await Homestay.findById(req.params.id)
            .populate('host', 'username email phoneNumber');

        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        res.json(homestay);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new homestay listing
router.post('/', [
    auth,
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').isObject(),
    body('price.perNight').isNumeric(),
    body('capacity').isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const homestay = new Homestay({
            ...req.body,
            host: req.user.id
        });

        await homestay.save();
        res.status(201).json(homestay);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update homestay
router.put('/:id', auth, async (req, res) => {
    try {
        const homestay = await Homestay.findById(req.params.id);
        
        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        if (homestay.host.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedHomestay = await Homestay.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedHomestay);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete homestay
router.delete('/:id', auth, async (req, res) => {
    try {
        const homestay = await Homestay.findById(req.params.id);
        
        if (!homestay) {
            return res.status(404).json({ message: 'Homestay not found' });
        }

        if (homestay.host.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await homestay.remove();
        res.json({ message: 'Homestay removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
