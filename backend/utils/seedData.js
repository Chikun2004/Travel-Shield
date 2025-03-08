require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Homestay = require('../models/Homestay');
const SafetyAlert = require('../models/SafetyAlert');
const connectDB = require('../config/db');

const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@travelshield.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'host1',
        email: 'host1@example.com',
        password: 'host123',
        role: 'host'
    },
    {
        username: 'traveler1',
        email: 'traveler1@example.com',
        password: 'travel123',
        role: 'user'
    }
];

const sampleHomestays = [
    {
        title: 'Cozy Mountain Retreat',
        description: 'A beautiful mountain retreat with panoramic views',
        location: {
            type: 'Point',
            coordinates: [77.1025, 28.7041],
            address: '123 Mountain View Road',
            city: 'Shimla',
            state: 'Himachal Pradesh',
            country: 'India'
        },
        price: {
            perNight: 100,
            cleaningFee: 20,
            serviceFee: 15
        },
        capacity: {
            guests: 4,
            bedrooms: 2,
            beds: 2,
            bathrooms: 2
        },
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Mountain View'],
        verificationStatus: 'verified'
    },
    {
        title: 'Beach Side Villa',
        description: 'Luxurious villa right on the beach',
        location: {
            type: 'Point',
            coordinates: [72.8479, 18.9217],
            address: '456 Beach Road',
            city: 'Goa',
            state: 'Goa',
            country: 'India'
        },
        price: {
            perNight: 150,
            cleaningFee: 30,
            serviceFee: 25
        },
        capacity: {
            guests: 6,
            bedrooms: 3,
            beds: 3,
            bathrooms: 3
        },
        amenities: ['WiFi', 'Pool', 'Beach Access', 'AC'],
        verificationStatus: 'verified'
    }
];

const sampleSafetyAlerts = [
    {
        type: 'scam',
        description: 'Fake tour operators in the area',
        severity: 'medium',
        location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139],
            address: 'Tourist Area',
            city: 'New Delhi',
            country: 'India'
        },
        status: 'active'
    },
    {
        type: 'unsafe_zone',
        description: 'Poor lighting in evening hours',
        severity: 'low',
        location: {
            type: 'Point',
            coordinates: [88.3639, 22.5726],
            address: 'City Center',
            city: 'Kolkata',
            country: 'India'
        },
        status: 'active'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Homestay.deleteMany();
        await SafetyAlert.deleteMany();

        // Create users
        const createdUsers = await User.create(sampleUsers);
        console.log('Sample users created');

        // Create homestays
        const homestaysWithHosts = sampleHomestays.map((homestay, index) => ({
            ...homestay,
            host: createdUsers[1]._id // Assign to host1
        }));
        await Homestay.create(homestaysWithHosts);
        console.log('Sample homestays created');

        // Create safety alerts
        const alertsWithReporters = sampleSafetyAlerts.map((alert, index) => ({
            ...alert,
            reporter: createdUsers[2]._id // Assign to traveler1
        }));
        await SafetyAlert.create(alertsWithReporters);
        console.log('Sample safety alerts created');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
