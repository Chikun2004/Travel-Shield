const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const SafetyAlert = require('../models/SafetyAlert');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Safety Alert Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Create test user and get token
        const user = await User.create({
            username: 'safetyuser',
            email: 'safety@example.com',
            password: 'password123'
        });
        userId = user._id;
        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await SafetyAlert.deleteMany({});
    });

    describe('POST /api/safety/alerts', () => {
        it('should create a new safety alert', async () => {
            const alertData = {
                type: 'theft',
                description: 'Pickpocketing reported in this area',
                severity: 'medium',
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139],
                    address: 'Test Location',
                    city: 'Test City'
                }
            };

            const res = await request(app)
                .post('/api/safety/alerts')
                .set('x-auth-token', token)
                .send(alertData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('type', 'theft');
            expect(res.body).toHaveProperty('reporter', userId.toString());
        });

        it('should reject invalid alert data', async () => {
            const invalidData = {
                type: 'invalid_type',
                description: '',
                severity: 'unknown'
            };

            const res = await request(app)
                .post('/api/safety/alerts')
                .set('x-auth-token', token)
                .send(invalidData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/safety/alerts', () => {
        beforeEach(async () => {
            await SafetyAlert.create({
                reporter: userId,
                type: 'scam',
                description: 'Test alert',
                severity: 'low',
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139],
                    address: 'Test Location',
                    city: 'Test City'
                }
            });
        });

        it('should get alerts within radius', async () => {
            const res = await request(app)
                .get('/api/safety/alerts')
                .query({
                    lat: 28.6139,
                    lng: 77.2090,
                    radius: 5000
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return empty array for distant location', async () => {
            const res = await request(app)
                .get('/api/safety/alerts')
                .query({
                    lat: 0,
                    lng: 0,
                    radius: 100
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(0);
        });
    });
});
